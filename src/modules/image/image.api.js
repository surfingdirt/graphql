const { BaseAPI } = require("../base");
const { IMAGE } = require("../../controllers");

module.exports = class ImageApi extends BaseAPI {
  constructor() {
    super();

    this.path = IMAGE;
    this.getImage = this.getImage.bind(this);
  }

  async getImage(id, token) {
    this.setToken(token);
    const response = await this.get(`${this.path}/${id}`);
    return response;
  }
};
