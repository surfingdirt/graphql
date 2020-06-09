const { BaseAPI } = require("../base");
const { REACTION } = require("../../controllers");

module.exports = class ReactionAPI extends BaseAPI {
  constructor(tracer) {
    super(tracer);

    this.path = REACTION;
  }

  async listUserReactions(token) {
    this.setToken(token);
    const response = await this.get(this.path);
    return response;
  }

  async createReaction(input, token) {
    this.setToken(token);
    // node-fetch or apollo is a little picky, so need to do this, in order
    // to have body.constructor === Object:
    const body = { ...input };
    const response = await this.post(this.path, body);
    return response;
  }

  async deleteReaction(id, input, token) {
    this.setToken(token);
    const response = await this.delete(`${this.path}/${id}`);
    return response;
  }
};
