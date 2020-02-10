const DEFAULT_LOCALE = 'en-US';

module.exports = {
  findContentVersionForLocale: (sourceParts, localeOptions) => {
    // User preference first
    for (let i = 0; i < localeOptions.length; i++) {
      const currentLocale = `${localeOptions[i].code}-${localeOptions[i].region}`;
        if (typeof sourceParts[currentLocale] !== 'undefined') {
          return sourceParts[currentLocale];
        }
    }

    // Default locale
    if (typeof sourceParts[DEFAULT_LOCALE] !== 'undefined') {
      return sourceParts[DEFAULT_LOCALE];
    }

    // No luck
    return '';
  },
};