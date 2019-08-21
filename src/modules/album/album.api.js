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

  async createAlbum(input, token) {
    this.setToken(token);
    // node-fetch or apollo is a little picky, so need to do this, in order
    // to have body.constructor === Object:
    const body = { ...input };
    const response = await this.post(this.path, body);
    return response;
  }

  async listAlbums(userId, token) {
    this.setToken(token);
    let response;
    // TODO: take this in from the graphql request, pass it on to the backend to enforce limits
    const params = '?limitMedia=2';
    if (userId) {
      response = await this.get(`/user/${userId}/albums${params}`);
    } else {
      response = await this.get(`${this.path}${params}`);
    }

    const filteredAlbums = response.filter(({id}) => id !== config.galleryAlbumId);

    // TODO: only keep the first 5 items in each album

    return filteredAlbums;
  }
};
