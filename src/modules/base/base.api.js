const { RESTDataSource } = require('apollo-datasource-rest');
const { ApolloError } = require("apollo-server-express");

const { apiUrl } = require('../../../env');

module.exports = class BaseAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = apiUrl;
  }

  async post(path, body, init) {
    try {
      const response = await super.post(path, body);
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
