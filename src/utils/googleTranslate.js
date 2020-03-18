const { Translate } = require('@google-cloud/translate').v2;
const { googleTranslationProjectId } = require('../../config');

module.exports = async (message, sourceLanguage, destinationLanguage) => {
  const translate = new Translate({ projectId: googleTranslationProjectId });
  const options = {
    from: sourceLanguage.split('-')[0],
    to: destinationLanguage.split('-')[0],
  };

  try {
    const response = await translate.translate(message, options);
    const [translation] = response;
    return translation;
  } catch (e) {
    console.error(e);
    return null;
  }
};
