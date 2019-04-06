const jwt = require("jsonwebtoken");

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
    const response = await this.post(this.path, { username, userP });
    if (response.token) {
      const {uid, exp } = jwt.decode(response.token);
      return {
        uid,
        accessToken: response.token,
        tokenType: "Bearer",
        exp
      };
    }

    return 'TODO: handle the wtf';
  }

  logout() {}
};
