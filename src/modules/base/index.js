const BaseAPI = require('./base.api');
const { BaseTypes } = require('./base.types');
const { hello } = require('./base.resolvers');

module.exports = {
  BaseAPI,
  BaseTypes,
  BaseQueryResolvers: { hello },
};
