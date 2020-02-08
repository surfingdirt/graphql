const { RESTDataSource } = require("apollo-datasource-rest");
const { ApolloError } = require("apollo-server-express");

const { apiUrl, tracing } = require("../../../config");

const BACKEND_DEBUG_KEY = "XDEBUG_SESSION_START";
const BACKEND_DEBUG_VALUE = "PHP_STORM";

const CONNECTION_REFUSED = 'ECONNREFUSED';
const CONNECTION_REFUSED_CODE = 17001;

const API_ERROR = 'apiError';
const BAD_INPUT_MESSAGE = 'badInput';

const TRACE_ID_HEADER = 'traceId';

const { alwaysDisabled: tracingAlwaysDisabled, enabled: tracingEnabled} = tracing;

module.exports = class BaseAPI extends RESTDataSource {
  constructor(tracer) {
    super();
    this.baseURL = apiUrl;
    this.token = null;
    this.debugBackend = false;
    this.tracer = tracer;
    this.parentSpan = null;
  }

  setDebugBackend(debugBackend) {
    this.debugBackend = debugBackend;
    return this;
  }

  setToken(token) {
    this.token = token;
    return this;
  }

  setParentSpan(span) {
    this.parentSpan = span;
    return this;
  }

  getParams(params = {}) {
    const additionalParams = {};
    if (this.debugBackend) {
      additionalParams[BACKEND_DEBUG_KEY] = BACKEND_DEBUG_VALUE;
    }
    return Object.assign({}, params, additionalParams);
  }

  parseError(e) {
    if (!e.extensions) {
      if (e.code === CONNECTION_REFUSED) {
        console.log("Could not connect to API", e);
        return new ApolloError('Could not connect to API', CONNECTION_REFUSED_CODE);
      }

      // This should never happen
      console.log("baseAPI parseError - unhandled error", e);
      return new ApolloError('Unhandled error', 0);
    }

    const { errors, code } = e.extensions.response.body;
    if (!errors) {
      return new ApolloError(API_ERROR);
    }

    if (errors.topLevelError) {
      const {message, code, backendStacktrace, type} = errors.topLevelError;
      return new ApolloError(message, code, {backendStacktrace, type});
    }

    return new ApolloError(BAD_INPUT_MESSAGE, code, { errors });
  }

  buildInit(init) {
    const headers = {};
    if (this.token) {
      headers['Authorization'] = this.token;
    }
    if (this.parentSpan) {
      const trace = this.parentSpan.id;
      headers['x-b3-flags'] = trace.isDebug();
      headers['x-b3-sampled'] = trace.sampled.value ? 1 : 0;
      headers['x-b3-parentspanid'] = trace.parentSpanId.value;
      headers['x-b3-spanid'] = trace.spanId;
      headers['x-b3-traceid'] = trace.traceId;
    }

    return Object.assign({}, init, { headers });
  }

  maybeTrace(name, operation) {
    if (tracingAlwaysDisabled) {
      // Tracing is forbidden
      return operation();
    }

    if (!this.parentSpan && !this.tracingRequested) {
      // Tracing if header
      return operation();
    }

    const tracingOptions = !!this.parentSpan ? {childOf: this.parentSpan} : {};

    return new Promise(async (resolve, reject) => {
      const span = this.tracer.startSpan(name, tracingOptions);
      const result = await operation();

      try {
        span.finish();

        // Make sure the next request will only be traced if it explicitly calls setSpan
        this.parentSpan = null;
        resolve(result);

      } catch (e) {
        span.log({
          error: true,
          errorMessage: e
        });
        span.finish();
        this.parentSpan = null;
      }
    });
  }

  get(path, params, init) {
    try {
      const actualParams = this.getParams(params);
      return this.maybeTrace(`GET ${path}`, () => super.get(path, actualParams, this.buildInit(init)));
    } catch (e) {
      const parsedError = this.parseError(e);
      throw parsedError;
    }
  }

  async post(path, body, init) {
    try {
      const params = this.getParams();
      const urlParams = new URLSearchParams(params).toString();
      const fullPath = urlParams ? `${path}?${urlParams}` : path;
      return this.maybeTrace(`POST ${fullPath}`, () => super.post(fullPath, body, this.buildInit(init)));
    } catch (e) {
      const parsedError = this.parseError(e);
      throw parsedError;
    }
  }

  async put(path, body, init) {
    try {
      const params = this.getParams();
      const urlParams = new URLSearchParams(params).toString();
      const fullPath = urlParams ? `${path}?${urlParams}` : path;
      return this.maybeTrace(`PUT ${fullPath}`, () => super.put(fullPath, body, this.buildInit(init)));
    } catch (e) {
      const parsedError = this.parseError(e);
      throw parsedError;
    }
  }

  async delete(path, params, init) {
    try {
      const actualParams = this.getParams(params);
      return this.maybeTrace(`DELETE ${path}`, () => super.delete(path, actualParams, this.buildInit(init)));
    } catch (e) {
      const {
        message,
        code,
        backendStacktrace,
        type
      } = e.extensions.response.body.errors.topLevelError;
      // Throw an error that GraphQL clients will understand
      throw new ApolloError(message, code, { backendStacktrace, type });
    }
  }
};
