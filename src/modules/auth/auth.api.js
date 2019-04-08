const jwt = require("jsonwebtoken");
const { AuthenticationError, ApolloError } = require("apollo-server-express");

const { BaseAPI } = require("../base");
const { TOKEN } = require("../../controllers");

module.exports = class AuthAPI extends BaseAPI {
  constructor() {
    super();

    this.path = TOKEN;
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async login(username, userP) {
    try {
      const response = await this.post(this.path, { username, userP });
      const { uid, exp } = jwt.decode(response.token);
      return {
        uid,
        accessToken: response.token,
        tokenType: "Bearer",
        exp
      };
    } catch (e) {
      const {
        message,
        code,
        trace,
        type
      } = e.extensions.response.body.errors.topLevelError;
      // Throw an error that GraphQL clients will understand
      throw new ApolloError(message, code, { trace, type });
    }
  }

  logout() {}
};
