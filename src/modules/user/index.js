const UserAPI = require("./user.api");
const User = require("./user.type");
const getUserResolvers = require("./user.resolvers");

module.exports = {
  User,
  UserAPI,
  getUserResolvers,
};
