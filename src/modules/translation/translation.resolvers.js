const { TranslationItemType } = require('../../constants');
const { ALBUM, COMMENT, MEDIA, USER } = require("../../utils/itemTypes");

const getTranslationResolvers = (tracer) => ({
  TranslationMutationResolvers: {
    translateAlbum: async (parent, { input: { itemId, locale } }, { dataSources: { albumAPI, translationAPI } }, { span }) => {
      const album = await albumAPI.getAlbum(itemId, null, 0, 0, { cacheOptions: { ttl: 0 } });
      await translationAPI.addAutoTranslation(ALBUM, locale, album);
      const updatedAlbum = await albumAPI.getComment(itemId, null);
      return updatedAlbum;
    },

    translateComment: async (parent, { input: { itemId, locale } }, { dataSources: { commentAPI, translationAPI } }, { span }) => {
      const comment = await commentAPI.getComment(itemId, null, { cacheOptions: { ttl: 0 } });
      await translationAPI.addAutoTranslation(COMMENT, locale, comment);
      const updatedComment = await commentAPI.getComment(itemId, null);
      return updatedComment;
    },

    translateMedia: async (parent, { input: { itemId, locale } }, { dataSources: { mediaAPI, translationAPI } }, { span }) => {
      const media = await mediaAPI.getMedia(itemId, null, { cacheOptions: { ttl: 0 } });
      await translationAPI.addAutoTranslation(MEDIA, locale, media);
      const updatedMedia = await mediaAPI.getMedia(itemId, null);
      return updatedMedia;
    },

    translateUser: async (parent, { input: { itemId, locale } }, { dataSources: { translationAPI, userAPI } }, { span }) => {
      const user = await userAPI.getUser(itemId, null, { cacheOptions: { ttl: 0 } });
      await translationAPI.addAutoTranslation(USER, locale, user);
      const updatedUser = await userAPI.getUser(itemId, null);
      return updatedUser;
    },
  },
});

module.exports = getTranslationResolvers;
