const { BaseAPI } = require("../base");
const { TRANSLATION } = require("../../controllers");

module.exports = class TranslationAPI extends BaseAPI {
  constructor(tracer) {
    super(tracer);

    this.path = TRANSLATION;
  }

  // TODO: implement actual auto-translation

  async addAutoTranslation(itemType, locale, item) {
    console.log('addAutoTranslation', {itemType, locale, item});
    const field = 'content';

    const original = item[field].find((entry) => !!entry.original);
    if (!original) {
      throw new Error(`Could not find original text for field '${field}' of item '${item.id}'`);
    }
    const translatedText = `This is a hardcoded translation for: '${original.text}'`;

    const translationPath = `${this.path}/comments/${item.id}`;
    const body = { translation: [{ field: 'content', locale, text: translatedText }]};
    const response = await this.post(translationPath, body);
    return response;
  }
  async updateAutoTranslation(itemType, itemId, locale) {}
  async removeAutoTranslation(itemType, itemId, locale) {}
};
