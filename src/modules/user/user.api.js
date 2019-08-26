const { BaseAPI } = require('../base');
const { USER } = require('../../controllers');

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

  async getMe(token) {
    this.setToken(token);
    const response = await this.get(`${this.path}/me`);
    return response;
  }

  async createUser(input, token) {
    // Should not be necessary, but the presence of a token indicates a problem, so keep it.
    this.setToken(token);
    // node-fetch or apollo is a little picky, so need to do this, in order
    // to have body.constructor === Object:
    const body = { ...input };
    const response = await this.post(this.path, body);
    return response;
  }

  async updateUser(userId, input, token) {
    this.setToken(token);
    const response = await this.put(`${this.path}/${userId}`, input);
    return response;
  }

  async listUsers(token) {
    this.setToken(token);
    const response = await this.get(`${this.path}`);
    return response;
  }

  async confirmEmail(userId, input) {
    const response = await this.put(
      `${this.path}/${userId}/confirmation`,
      Object.assign({}, input),
    );
    return response;
  }
};
