const { ApolloError } = require("apollo-server-express");

const {
  MediaType,
  VideoType,
  StorageType,
  ErrorCodes
} = require("../../constants");
const { getVendorUrl, getEmbedUrl } = require('../../utils/videoUtils');
const { buildThumbsAndImages } = require("../../utils/thumbs");

module.exports = {
  VideoTypeResolvers: {},
  VideoQueryResolvers: {
    video: async (
      parent,
      args,
      { token, dataSources: { mediaAPI, userAPI } }
    ) => {
      const video = await mediaAPI.getMedia(args.id, token);
      const submitter = video.submitter.id
        ? await userAPI.getUser(video.submitter.id, token)
        : null;

      return Object.assign(
        {},
        video,
        { submitter, mediaType: MediaType.VIDEO },
        buildThumbsAndImages(video, false)
      );
    }
  },
  VideoMutationResolvers: {
    createVideo: async (
      parent,
      args,
      { token, dataSources: { mediaAPI } }
    ) => {
      const { input } = args;

      const creationPayload = Object.assign({}, input, {
        mediaType: MediaType.VIDEO,
        storageType: StorageType.LOCAL
      });

      const video = await mediaAPI.createMedia(creationPayload, token);
      return Object.assign(
        {},
        video,
        buildThumbsAndImages(video, false)
      );
    },

    updateVideo: async (
      parent,
      args,
      { token, dataSources: { mediaAPI } }
    ) => {
      const { id, input } = args;

      const updatePayload = Object.assign({}, input);

      const video = await mediaAPI.updateMedia(id, updatePayload, token);
      return Object.assign(
        {},
        video,
        buildThumbsAndImages(video, false)
      );
    }
  },
  VideoFieldResolvers: {
    async album(
      parent,
      args,
      {
        token,
        dataSources: { albumAPI }
      }
    ) {
      if (!parent.album.id) {
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
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.getUser(parent.lastEditor.id, token);
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
      return getVendorUrl(parent);
    },

    embedUrl(parent) {
      return getEmbedUrl(parent);
    },
  }
};
