const { RESTDataSource } = require("apollo-datasource-rest");
const { ApolloError } = require("apollo-server-express");

const { apiUrl } = require("../../../env");

const BACKEND_DEBUG_KEY = "XDEBUG_SESSION_START";
const BACKEND_DEBUG_VALUE = "PHP_STORM";

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
      let toto = 1;
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

  async post(path, body, init) {
    try {
      const urlParams = new URLSearchParams(this.getParams());
      const response = await super.post(
        `${path}?${urlParams.toString()}`,
        body,
        init
      );
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
