const jwt = require("jsonwebtoken");

const { BaseAPI } = require("../base");
const { TOKEN } = require("../../controllers");

module.exports = class AuthAPI extends BaseAPI {
  constructor(tracer) {
    super(tracer);

    this.path = TOKEN;
    this.oAuthLoginPath = `${TOKEN}/oauth-login`;
    this.login = this.login.bind(this);
    this.loginOAuth = this.loginOAuth.bind(this);
    this.logout = this.logout.bind(this);
  }

  async login(username, userP) {
    const response = await this.post(this.path, { username, userP });
    const { uid, exp } = jwt.decode(response.token);
    return {
      uid,
      accessToken: response.token,
      tokenType: "Bearer",
      expires: exp,
    };
  }

  async loginOAuth(token) {
    const response = await this.post(this.oAuthLoginPath, { token });
    const { uid, exp } = jwt.decode(response.token);
    return {
      uid,
      accessToken: response.token,
      tokenType: "Bearer",
      expires: exp,
    };
  }

  async logout(token) {
    const response = await this.delete(this.path, {}, {
      headers: { Authorization: token }
    });
    return response;
  }
};
