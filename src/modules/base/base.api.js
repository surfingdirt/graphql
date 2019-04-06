const { RESTDataSource } = require('apollo-datasource-rest');

const { apiUrl } = require('../../../env');

module.exports = class BaseAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = apiUrl;
  }
};
