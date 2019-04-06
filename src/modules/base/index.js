const { Query } = require('./base.type');
const { hello } = require('./base.resolvers');

module.exports = {
  Query,
  BaseQueryResolvers: { hello },
};
