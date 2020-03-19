const { MediaType } = require('../../constants');
const { ALBUM, COMMENT, MEDIA, USER } = require("../../utils/itemTypes");
const { buildThumbsAndImages } = require('../../utils/thumbs');

const getTranslationResolvers = (tracer) => ({
  TranslationMutationResolvers: {
    translateAlbum: async (parent, { input: { itemId, locale } }, { dataSources: { albumAPI, translationAPI } }, { span }) => {
      const album = await albumAPI.getAlbum(itemId, null, 0, 0, { cacheOptions: { ttl: 0 } });
      await translationAPI.addAutoTranslation(ALBUM, locale, album);
      const updatedAlbum = await albumAPI.getAlbum(itemId, null);
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

      const isPhoto = (parent) => parent.mediaType === MediaType.PHOTO;

      const response = Object.assign(
        {},
        updatedMedia,
        buildThumbsAndImages(updatedMedia, isPhoto(updatedMedia)),
      );
      console.log(response);
      return response;
    },

    translateUser: async (parent, { input: { itemId, locale } }, { dataSources: { imageAPI, translationAPI, userAPI } }, { span }) => {
      const user = await userAPI.getUser(itemId, null, { cacheOptions: { ttl: 0 } });
      await translationAPI.addAutoTranslation(USER, locale, user);
      const updatedUser = await userAPI.getUser(itemId, null);

      const avatarThumbs = updatedUser.avatar
        ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(updatedUser.avatar, null), true).thumbs
        : null;
      const coverThumbs = updatedUser.cover
        ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(updatedUser.cover, null), true).images
        : null;

      return Object.assign({}, updatedUser, { avatar: avatarThumbs, cover: coverThumbs });
    },
  },
});

module.exports = getTranslationResolvers;
