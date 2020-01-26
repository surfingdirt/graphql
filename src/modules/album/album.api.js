const config = require('../../../config');
const { BaseAPI } = require('../base');
const { ALBUM } = require('../../controllers');
const tracer = require("../../tracer");

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
    // node-fetch or apollo is a little picky, so need to do this, in order
    // to have body.constructor === Object:
    const body = { ...input };
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
};
