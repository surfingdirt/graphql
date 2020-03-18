const { BaseAPI } = require("../base");
const { MEDIA } = require("../../controllers");
const { formatTranslatedFields } = require("../../utils/translate");

module.exports = class MediaApi extends BaseAPI {
  constructor(tracer) {
    super(tracer);

    this.path = MEDIA;
    this.getMedia = this.getMedia.bind(this);
  }

  async getMedia(id, token, options = null) {
    this.setToken(token);
    const response = await this.get(`${this.path}/${id}`, options);
    return response;
  }

  async createMedia(input, token) {
    this.setToken(token);
    const body = formatTranslatedFields(['description', 'title'], input);
    const response = await this.post(this.path, body);
    return response;
  }

  async updateMedia(id, input, token) {
    this.setToken(token);
    const body = formatTranslatedFields(['description', 'title'], input);
    const response = await this.put(`${this.path}/${id}`, body);
    return response;
  }

  async deleteMedia(id, token) {
    this.setToken(token);
    const response = await this.delete(`${this.path}/${id}`);
    return response;
  }
};
