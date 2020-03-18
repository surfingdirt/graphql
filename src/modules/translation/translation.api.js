const { BaseAPI } = require("../base");
const { TRANSLATION } = require("../../controllers");
const googleTranslate = require("../../utils/googleTranslate");
const { ALBUM, COMMENT, MEDIA, USER } = require("../../utils/itemTypes");

// The locale we'll consider as original if nothing else works
const DEFAULT_LOCALE = 'en-US';

const fieldsPerType = {
  [ALBUM]: ['description', 'title'],
  [COMMENT]: ['content'],
  [MEDIA]: ['description', 'title'],
  [USER]: ['bio'],
};

const pathPerType = {
  [ALBUM]: 'album',
  [COMMENT]: 'comments',
  [MEDIA]: 'media',
  [USER]: 'user',
};

module.exports = class TranslationAPI extends BaseAPI {
  constructor(tracer) {
    super(tracer);

    this.path = TRANSLATION;
  }

  async addAutoTranslation(itemType, locale, item) {
    // This was bound to come back and bite me in the ass:
    const id = item.id || item.userId;

    const promises = [];
    const fields = fieldsPerType[itemType];
    if (!fields || fields.length === 0) {
      throw new Error(`No translatable fields for item type '${itemType}'`);
    }
    const pathPart = pathPerType[itemType];
    if (!pathPart) {
      throw new Error(`No path part for item type '${itemType}'`);
    }

    const translatedFields = [];
    fields.forEach((field) => {
      if (!item[field]) {
        // NULL case
        return;
      }

      let original = item[field].find((entry) => !!entry.original);
      if (!original && item[field].length === 1) {
        original = item[field][0];
      }
      if (!original && item[field].length > 1) {
        original = item[field].find((entry) => entry.locale === DEFAULT_LOCALE);
      }
      if (!original) {
        throw new Error(`Could not find original text for field '${field}' of item '${id}'`);
      }
      // const translatedText = `This is a hardcoded translation for: '${original.text}'`;
      translatedFields.push(field);
      promises.push(googleTranslate(original.text, original.locale, locale));
    });

    const translations = await Promise.all(promises);

    const translationPath = `${this.path}/${pathPart}/${id}`;
    const translation = [];
    translatedFields.forEach((field, index) => {
      translation.push({ field, locale, text: translations[index] });
    });

    await this.post(translationPath, { translation });
  }

  async updateAutoTranslation(itemType, itemId, locale) {}

  async removeAutoTranslation(itemType, itemId, locale) {}
};
