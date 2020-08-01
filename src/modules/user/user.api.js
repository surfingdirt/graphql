const jwt = require("jsonwebtoken");

const { BaseAPI } = require('../base');
const { USER } = require('../../controllers');
const { formatTranslatedFields } = require("../../utils/translate");

module.exports = class UserApi extends BaseAPI {
  constructor(tracer) {
    super(tracer);

    this.path = USER;
    this.pathOAuth = `${USER}/oauth`;
    this.getUser = this.getUser.bind(this);
  }

  async getUser(userId, token, options = null) {
    this.setToken(token);
    const response = await this.get(`${this.path}/${userId}`, options);
    return response;
  }

  async getMe(token) {
    this.setToken(token);
    const response = await this.get(`${this.path}/me`);
    return response;
  }

  async createUser(input) {
    const body = formatTranslatedFields('bio', input);
    const response = await this.post(this.path, body);
    return response;
  }

  async createUserOAuth(input) {
    const { token, user } = await this.post(this.pathOAuth, input);
    const { uid, exp } = jwt.decode(token);

    return {
      user,
      token: {
        uid,
        accessToken: token,
        tokenType: "Bearer",
        expires: exp,
      },
    };
  }

  async updateUser(userId, input, token) {
    this.setToken(token);
    const body = formatTranslatedFields('bio', input);
    const response = await this.put(`${this.path}/${userId}`, body);
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

  async forgotPassword(input) {
    const body = { username: input.username };
    const response = await this.post(`/lost-password/`, body);
    return response;
  }

  async activateNewPassword(userId, input) {
    const body = { aK: input.activationKey };
    const response = await this.post(`${this.path}/${userId}/activate-new-password/`, body);
    return response;
  }

  async emailExists(token, email) {
    this.setToken(token);
    const response = await this.get(`${this.path}/email-exists?email=${email}`);
    return response;
  }

  async usernameExists(username) {
    const response = await this.get(`${this.path}/username-exists?username=${username}`);
    return response;
  }
};
