const { BaseAPI } = require("../base");
const { COMMENT } = require("../../controllers");
const { formatTranslatedFields } = require("../../utils/translate");

module.exports = class CommentAPI extends BaseAPI {
  constructor(tracer) {
    super(tracer);

    this.path = COMMENT;
    this.getComment = this.getComment.bind(this);
  }

  async listComments(parentId, parentType, token) {
    this.setToken(token);
    const response = await this.get(`${parentType}/${parentId}/comments`);
    return response;
  }

  async getComment(id, token, options = null) {
    this.setToken(token);
    const response = await this.get(`${this.path}/${id}`, options);
    return response;
  }

  async createComment(input, token) {
    this.setToken(token);
    // node-fetch or apollo is a little picky, so need to do this, in order
    // to have body.constructor === Object: const body = { ...input };
    const body = formatTranslatedFields('content', input);
    const response = await this.post(this.path, body);
    return response;
  }

  async updateComment(id, input, token) {
    this.setToken(token);
    const body = formatTranslatedFields('content', input);
    const response = await this.put(`${this.path}/${id}`, body);
    return response;
  }

  async deleteComment(id, token) {
    this.setToken(token);
    const response = await this.delete(`${this.path}/${id}`);
    return response;
  }
};
