const config = require("../../../config");
const { BaseAPI } = require("../base");
const { ALBUM } = require("../../controllers");

module.exports = class AlbumApi extends BaseAPI {
  constructor() {
    super();

    this.path = ALBUM;
    this.getAlbum = this.getAlbum.bind(this);
  }

  async getAlbum(id, token) {
    this.setToken(token);
    const response = await this.get(`${this.path}/${id}`);
    return response;
  }

  async listAlbums(userId, token) {
    this.setToken(token);
    let response;
    if (userId) {
      response = await this.get(`/user/${userId}/albums`);
    } else {
      response = await this.get(`${this.path}`);
    }

    const filteredAlbums = response.filter(({id}) => id !== config.galleryAlbumId);

    // TODO: only keep the first 5 items in each album

    return filteredAlbums;
  }
};
