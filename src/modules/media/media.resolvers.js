const { MediaType } = require('../../constants');
const { buildThumbsAndImages } = require('../../utils/thumbs');
const { submitterResolver } = require('../../utils/users');
const { getVendorUrl, getEmbedUrl } = require('../../utils/videoUtils');
const { findContentVersionForLocale } = require('../../utils/language');

const StorageType = {
  LOCAL: "0"
};
const ImageSize = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
};

const ImageType = {
  JPG: "jpg",
  PNG: "png",
  GIF: "gif",
  WEBP: "webp"
};

const isVideo = (parent) => parent.mediaType === MediaType.VIDEO;
const isPhoto = (parent) => parent.mediaType === MediaType.PHOTO;

const getMediaResolvers = (tracer) => ({
  MediaTypeResolvers: {
    MediaType: {
      PHOTO: "photo",
      VIDEO: "video"
    },
    MediaSubType: {
      DAILYMOTION: "dailymotion",
      FACEBOOK: "facebook",
      INSTAGRAM: "instagram",
      VIMEO: "vimeo",
      YOUTUBE: "youtube",
      IMG: "img",
      JPG: "jpg",
      PNG: "png",
      GIF: "gif",
      WEBP: "webp"
    },
    StorageType,
    ImageSize,
    ImageType
  },
  MediaQueryResolvers: {
    media: async (parent, args, { token, dataSources: { mediaAPI } }, { span }) => {
      const media = await mediaAPI.setParentSpan(span).getMedia(args.id, token);

      return Object.assign(
        {},
        media,
        buildThumbsAndImages(media, isPhoto(media)),
      );
    },
  },
  MediaMutationResolvers: {
    deleteMedia: async (parent, args, { token, dataSources: { mediaAPI } }, { span }) => {
      const response = await mediaAPI.setParentSpan(span).deleteMedia(args.id, token);
      return response.status;
    },
  },
  MediaFieldResolvers: {
    description(parent, args, { locale }) {
      const translated = findContentVersionForLocale(parent.description, locale);
      return translated;
    },

    title(parent, args, { locale }) {
      const translated = findContentVersionForLocale(parent.title, locale);
      return translated;
    },

    async album(parent, args, { token, dataSources: { albumAPI } }, { span }) {
      if (!parent.album || !parent.album.id) {
        return null;
      }
      return await albumAPI.setParentSpan(span).getAlbum(parent.album.id, token);
    },

    embedUrl(parent) {
      if (!isVideo(parent)) {
        return null;
      }

      return getEmbedUrl(parent);
    },

    async lastEditor(parent, args, { token, dataSources: { userAPI } }, { span }) {
      if (!parent.lastEditor || !parent.lastEditor.id) {
        return null;
      }
      return await userAPI.setParentSpan(span).getUser(parent.lastEditor.id, token);
    },

    submitter(parent, args, { token, dataSources: { imageAPI, userAPI } }, { span }) {
      return submitterResolver(parent, args, { token, dataSources: { imageAPI, userAPI } }, span);
    },

    async users(parent, args, { token, dataSources: { userAPI } }, { span }) {
      const users = [];
      for (let userId of parent.users) {
        users.push(await userAPI.setParentSpan(span).getUser(userId, token));
      }
      return users;
    },

    vendorUrl(parent) {
      if (!isVideo(parent)) {
        return null;
      }

      return getVendorUrl(parent);
    },
  }
});

module.exports = getMediaResolvers;
