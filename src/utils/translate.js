module.exports = {
  formatTranslatedFields: (fieldSpec, data) => {
    const translatedFields = {};

    const fields = Array.isArray(fieldSpec) ? fieldSpec : [fieldSpec];

    fields.forEach((name) => {
      const hasText = data[name] && data[name].text && data[name].text.length > 0;
      translatedFields[name] = hasText ? [ data[name] ] : null;
    });

    const result = Object.assign({}, data, translatedFields);
    return result;
  },
};

