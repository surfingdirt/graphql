const { RESTDataSource } = require("apollo-datasource-rest");
const { ApolloError, UserInputError } = require("apollo-server-express");

const { apiUrl } = require("../../../env");

const BACKEND_DEBUG_KEY = "XDEBUG_SESSION_START";
const BACKEND_DEBUG_VALUE = "PHP_STORM";

const BAD_INPUT_MESSAGE = 'badInput';

module.exports = class BaseAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = apiUrl;
    this.token = null;
    this.debugBackend = false;
  }

  setDebugBackend(debugBackend) {
    this.debugBackend = debugBackend;
  }

  setToken(token) {
    this.token = token;
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
      // This should never happen
      console.log("baseAPI parseError - unhandled error", e);
      return new ApolloError('Unhandled error', 0);
      return e;
    }

    const { errors, code } = e.extensions.response.body;
    if (errors.topLevelError) {
      const { message, code, backendStacktrace, type } = errors.topLevelError;
      return new ApolloError(message, code, { backendStacktrace, type });
    }

    return new ApolloError(BAD_INPUT_MESSAGE, code, { errors });
  }

  async get(path, params, init) {
    try {
      const actualParams = this.getParams(params);
      if (this.token) {
        init = Object.assign({}, init, {
          headers: { Authorization: this.token }
        });
      }
      const response = await super.get(path, actualParams, init);
      return response;
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
      const response = await super.post(fullPath, body, init);
      return response;
    } catch (e) {
      const parsedError = this.parseError(e);
      throw parsedError;
    }
  }

  async delete(path, params, init) {
    try {
      const actualParams = this.getParams(params);
      const response = await super.delete(path, actualParams, init);
      return response;
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
