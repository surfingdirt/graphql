const { submitterResolver } = require('../../utils/users');

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

module.exports = {
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
    }
  }
};
