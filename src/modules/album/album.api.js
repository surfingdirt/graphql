const config = require('../../../config');
const { BaseAPI } = require('../base');
const { ALBUM } = require('../../controllers');
const tracer = require("../../tracer");
const { formatTranslatedFields } = require("../../utils/translate");

module.exports = class AlbumApi extends BaseAPI {
  constructor(tracer) {
    super(tracer);

    this.path = ALBUM;
    this.getAlbum = this.getAlbum.bind(this);
  }

  async getAlbum(id, token, countItems, startItem) {
    this.setToken(token);
    const params = this.getParams({
      countItems,
      startItem,
    });
    const response = await this.get(`${this.path}/${id}`, params);
    return response;
  }

  async createAlbum(input, token) {
    this.setToken(token);
    const body = formatTranslatedFields(['description', 'title'], input);
    const response = await this.post(this.path, body);
    return response;
  }

  async listAlbums(userId, token, countItems, count, start, sort, dir, skipAlbums) {
    this.setToken(token);
    const params = this.getParams({
      countItems,
      count,
      start,
      sort,
      dir,
      'skipAlbums[]': skipAlbums,
    });
    let response;
    if (userId) {
      response = await this.get(`/user/${userId}/albums`, params);
    } else {
      response = await this.get(`${this.path}`, params);
    }

    return response;
  }

  async updateAlbum(id, input, token) {
    this.setToken(token);
    const body = formatTranslatedFields(['description', 'title'], input);
    const response = await this.put(`${this.path}/${id}`, body);
    return response;
  }

  async deleteAlbum(id, token) {
    this.setToken(token);
    const response = await this.delete(`${this.path}/${id}`);
    return response;
  }

};
