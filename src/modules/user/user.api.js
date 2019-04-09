const { BaseAPI } = require("../base");
const { USER } = require("../../controllers");

module.exports = class UserApi extends BaseAPI {
  constructor() {
    super();

    this.path = USER;
    this.getUser = this.getUser.bind(this);
  }

  async getUser(userId, token) {
    this.setToken(token);
    const response = await this.get(`${this.path}/${userId}`);
    return response;
  }
};
