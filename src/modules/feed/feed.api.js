const { BaseAPI } = require("../base");
const { FEED } = require("../../controllers");

module.exports = class FeedAPI extends BaseAPI {
  constructor(tracer) {
    super(tracer);

    this.path = FEED;
    this.getFeed = this.getFeed.bind(this);
  }

  async getFeed(token, options = null) {
    this.setToken(token);
    const response = await this.get(`${this.path}`, options);
    return response;
  }
};
