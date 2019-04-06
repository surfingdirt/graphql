const AuthAPI = require('./auth.api');
const { Auth } = require('./auth.type');
const { login, logout } = require('./auth.resolvers');

module.exports = {
  Auth,
  AuthAPI,
  AuthMutationResolvers: { login, logout },
};
