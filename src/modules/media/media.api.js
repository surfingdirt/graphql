const { BaseAPI } = require("../base");
const { MEDIA } = require("../../controllers");

module.exports = class MediaApi extends BaseAPI {
  constructor() {
    super();

    this.path = MEDIA;
    this.getMedia = this.getMedia.bind(this);
  }

  async getMedia(id, token) {
    this.setToken(token);
    const response = await this.get(`${this.path}/${id}`);
    return response;
  }
};
