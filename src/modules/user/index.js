const UserAPI = require("./user.api");
const User = require("./user.type");
const { UserFieldResolvers, UserMutationResolvers, UserQueryResolvers } = require("./user.resolvers");

module.exports = {
  User,
  UserAPI,
  UserFieldResolvers,
  UserMutationResolvers,
  UserQueryResolvers
};
