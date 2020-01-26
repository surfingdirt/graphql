const AuthAPI = require('./auth.api');
const Auth = require('./auth.type');
const getAuthResolvers = require('./auth.resolvers');

module.exports = {
  Auth,
  AuthAPI,
  getAuthResolvers
};
