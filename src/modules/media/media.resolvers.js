const { MediaType } = require('../../constants');
const { buildThumbsAndImages } = require('../../utils/thumbs');
const { submitterResolver } = require('../../utils/users');
const { getVendorUrl, getEmbedUrl } = require('../../utils/videoUtils');

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
  MediaFieldResolvers: {
    async album(
      parent,
      args,
      {
        token,
        dataSources: { albumAPI }
      }
    ) {
      if (!parent.album || !parent.album.id) {
        return null;
      }
      return await albumAPI.getAlbum(parent.album.id, token);
    },

    embedUrl(parent) {
      if (!isVideo(parent)) {
        return null;
      }

      return getEmbedUrl(parent);
    },

    async lastEditor(
      parent,
      args,
      {
        token,
        dataSources: { userAPI }
      }
    ) {
      if (!parent.lastEditor || !parent.lastEditor.id) {
        return null;
      }
      return await userAPI.getUser(parent.lastEditor.id, token);
    },

    submitter(parent, args, { token, dataSources: { imageAPI, userAPI } }) {
      return submitterResolver(parent, args, { token, dataSources: { imageAPI, userAPI } });
    },

    async users(
      parent,
      args,
      {
        token,
        dataSources: { userAPI }
      }
    ) {
      const users = [];
      for (let userId of parent.users) {
        users.push(await userAPI.getUser(userId, token));
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
