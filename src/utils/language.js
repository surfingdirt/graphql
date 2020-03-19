const DEFAULT_LOCALE = 'en-US';

const _findContentVersionForLocale = (sourceParts, localeOptions) => {
  if (sourceParts === null) {
    return {
      locale: '',
      text: '',
      original: false,
    };
  }

  if (typeof sourceParts === 'string') {
    return {
      locale: DEFAULT_LOCALE,
      text: sourceParts,
      original: true,
    };
  }

  const onlyOneLocale = localeOptions.length === 1;

  // Full locale match based on user preferences
  for (let i = 0; i < localeOptions.length; i++) {
    const currentLocale = `${localeOptions[i].code}-${localeOptions[i].region}`;
    const match = sourceParts.find(({ locale }) => locale === currentLocale);
    if (match) {
      if (onlyOneLocale) {
        match.original = true;
      }
      return match;
    }
  }

  // No match on full locale - try with the same language code only
  for (let i = 0; i < localeOptions.length; i++) {
    const currentCode = `${localeOptions[i].code}-`;
    const match = sourceParts.find(({ locale }) => locale.indexOf(currentCode) === 0);
    if (match) {
      if (onlyOneLocale) {
        match.original = true;
      }
      return match;
    }
  }

  // Default locale
  const match = sourceParts.find(({ locale }) => locale === DEFAULT_LOCALE);
  if (match) {
    if (onlyOneLocale) {
      match.original = true;
    }
    return match;
  }

  // Is there... anything... we can send back?
  if (sourceParts.length >= 0) {
    // Grab the first available translation
    const match = sourceParts[0];
    if (onlyOneLocale) {
      match.original = true;
    }
    return match;
  }

  // No luck
  return {
    locale: '',
    text: '',
    original: false,
  };
};

const maybeAddOriginalFlag = (translatedText) => {
  if (typeof translatedText.original === 'undefined') {
    translatedText.original = false;
  }

  return translatedText
};

module.exports = {
  findContentVersionForLocale: (sourceParts, localeOptions) => {
    return maybeAddOriginalFlag(_findContentVersionForLocale(sourceParts, localeOptions));
  },
};