const DEFAULT_LOCALE = 'en-US';

module.exports = {
  findContentVersionForLocale: (sourceParts, localeOptions) => {
    if (sourceParts === null) {
      return '';
    }

    if (typeof sourceParts === 'string') {
      return sourceParts;
    }

    // User preference first
    for (let i = 0; i < localeOptions.length; i++) {
      const currentLocale = `${localeOptions[i].code}-${localeOptions[i].region}`;
        if (typeof sourceParts[currentLocale] !== 'undefined') {
          return sourceParts[currentLocale];
        }
    }

    // Same code?
    for (let i = 0; i < localeOptions.length; i++) {
      const currentCode = `${localeOptions[i].code}-`;
      const found = Object.entries(sourceParts).find(([locale]) => {
        return locale.indexOf(currentCode) === 0;
      });
      if (found) {
        return found[1];
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