const config = require("../../../config");
const { BaseAPI } = require("../base");
const { ALBUM } = require("../../controllers");

module.exports = class AlbumApi extends BaseAPI {
  constructor() {
    super();

    this.path = ALBUM;
    this.getAlbum = this.getAlbum.bind(this);
  }

  async getAlbum(id, token, countItems) {
    this.setToken(token);
    const params = {
      countItems,
    }
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

  async listAlbums(userId, token, countItems, count, start, sort, dir) {
    this.setToken(token);
    const params = {
      countItems, count, start, sort, dir,
    }
    let response;
    if (userId) {
      response = await this.get(`/user/${userId}/albums`, params);
    } else {
      response = await this.get(`${this.path}`, params);
    }

    const filteredAlbums = response.filter(({id}) => id !== config.galleryAlbumId);
    return filteredAlbums;
  }
};
