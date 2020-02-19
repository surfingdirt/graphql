const { TranslationItemType } = require('../../constants');

const getTranslationResolvers = (tracer) => ({
  TranslationMutationResolvers: {
    addAutoTranslation: async (parent, args, { dataSources: { translationAPI } }, { span }) => {
      const response = await translationAPI.addAutoTranslation();
      return response;
    },
    updateAutoTranslation: async (parent, args, { dataSources: { translationAPI } }, { span }) => {
      const response = await translationAPI.updateAutoTranslation();
      return response;
    },
    removeAutoTranslation: async (parent, args, { dataSources: { translationAPI } }, { span }) => {
      const response = await translationAPI.removeAutoTranslation();
      return response;
    },
  },
});

module.exports = getTranslationResolvers;
