const { BaseAPI } = require("../base");
const { FEED } = require("../../controllers");

module.exports = class FeedAPI extends BaseAPI {
  constructor(tracer) {
    super(tracer);

    this.path = FEED;
    this.getFeed = this.getFeed.bind(this);
  }

  async getFeed(token, count, offset, options = null) {
    this.setToken(token);
    const params = this.getParams({
      count,
      offset,
    });
    if (options && Object.entries(options).length > 0) {
      Object.entries(options).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    const response = await this.get(`${this.path}`, params);
    return response;
  }
};
