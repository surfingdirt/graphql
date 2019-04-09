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
};
