const { BaseAPI } = require("../base");
const { TRANSLATION } = require("../../controllers");

module.exports = class CommentAPI extends BaseAPI {
  constructor(tracer) {
    super(tracer);

    this.path = TRANSLATION;
    this.getComment = this.getComment.bind(this);
  }

  // TODO: implement actual auto-translation

  async addAutoTranslation(itemType, itemId, fieldName, locale) {}
  async updateAutoTranslation(itemType, itemId, fieldName, locale) {}
  async removeAutoTranslation(itemType, itemId, fieldName, locale) {}
};
