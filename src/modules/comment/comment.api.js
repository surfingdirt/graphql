const { BaseAPI } = require("../base");
const { COMMENT } = require("../../controllers");

module.exports = class CommentAPI extends BaseAPI {
  constructor() {
    super();

    this.path = COMMENT;
    this.getComment = this.getComment.bind(this);
  }

  async listComments(parentId, parentType, token) {
    this.setToken(token);
    const response = await this.get(`${parentType}/${parentId}/comments?XDEBUG_START_SESSION=PHPSTORM`);
    return response;
  }

  async getComment(id, token) {
    this.setToken(token);
    const response = await this.get(`${this.path}/${id}`);
    return response;
  }

  async createComment(input, token) {
    this.setToken(token);
    // node-fetch or apollo is a little picky, so need to do this, in order
    // to have body.constructor === Object:
    const body = { ...input };
    const response = await this.post(this.path, body);
    return response;
  }

  async updateComment(id, input, token) {
    this.setToken(token);
    // node-fetch or apollo is a little picky, so need to do this, in order
    // to have body.constructor === Object:
    const body = { ...input };
    const response = await this.put(`${this.path}/${id}`, body);
    return response;
  }
};
