const UserAPI = require('./user.api');
const { User } = require('./user.type');
const { getUser } = require('./user.resolvers');

module.exports = {
  User,
  UserAPI,
  UserQueryResolvers: { getUser },
};
