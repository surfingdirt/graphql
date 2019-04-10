const UserAPI = require("./user.api");
const User = require("./user.type");
const { UserFieldResolvers, UserQueryResolvers } = require("./user.resolvers");

module.exports = {
  User,
  UserAPI,
  UserFieldResolvers,
  UserQueryResolvers
};
