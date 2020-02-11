const DEFAULT_LOCALE = 'en-US';

module.exports = {
  findContentVersionForLocale: (sourceParts, localeOptions) => {
    if (sourceParts === null) {
      return {
        locale: '',
        text: '',
      };
    }

    if (typeof sourceParts === 'string') {
      return {
        locale: DEFAULT_LOCALE,
        text: sourceParts,
      };
    }

    // User preference first
    for (let i = 0; i < localeOptions.length; i++) {
      const currentLocale = `${localeOptions[i].code}-${localeOptions[i].region}`;
        if (typeof sourceParts[currentLocale] !== 'undefined') {
          return {
            locale: currentLocale,
            text: sourceParts[currentLocale],
          };
        }
    }

    // Same code?
    for (let i = 0; i < localeOptions.length; i++) {
      const currentCode = `${localeOptions[i].code}-`;
      const found = Object.entries(sourceParts).find(([locale]) => {
        return locale.indexOf(currentCode) === 0;
      });
      if (found) {
        return {
          locale: found[0],
          text: found[1],
        };
      }
    }

    // Default locale
    if (typeof sourceParts[DEFAULT_LOCALE] !== 'undefined') {
      return {
        locale: DEFAULT_LOCALE,
        text: sourceParts[DEFAULT_LOCALE],
      };
    }

    // No luck
    return {
      locale: '',
      text: '',
    };
  },
};