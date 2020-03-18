const { TranslationItemType } = require('../../constants');



const getTranslationResolvers = (tracer) => ({
  TranslationMutationResolvers: {
    translateAlbum: async (parent, args, { dataSources: { translationAPI } }, { span }) => {
      const response = await translationAPI.addAutoTranslation();
      return response;
    },
    translateComment: async (parent, { input: { itemId, locale } }, { dataSources: { commentAPI, translationAPI } }, { span }) => {
      const comment = await commentAPI.getComment(itemId, null, { cacheOptions: { ttl: 0 } });
      await translationAPI.addAutoTranslation('comment', locale, comment);
      const updatedComment = await commentAPI.getComment(itemId, null);
      return updatedComment;
    },
    translateMedia: async (parent, args, { dataSources: { translationAPI } }, { span }) => {
      const response = await translationAPI.addAutoTranslation();
      return response;
    },
    translateUser: async (parent, args, { dataSources: { translationAPI } }, { span }) => {
      const response = await translationAPI.addAutoTranslation();
      return response;
    },
  },
});

module.exports = getTranslationResolvers;
