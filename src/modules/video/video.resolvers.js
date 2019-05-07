const { MediaType, StorageType } = require("../../constants");
const { buildThumbsAndImages } = require("../../utils/thumbs");

module.exports = {
  VideoTypeResolvers: {},
  VideoQueryResolvers: {
    video: async (
      parent,
      args,
      { token, supportsWebP, dataSources: { videoAPI, userAPI } }
    ) => {
      const video = await videoAPI.getVideo(args.id, token);
      const submitter = video.submitter.id
        ? await userAPI.getUser(video.submitter.id, token)
        : null;

      return Object.assign(
        {},
        video,
        { submitter },
        buildThumbsAndImages(video, false, supportsWebP)
      );
    }
  },
  VideoMutationResolvers: {
    createVideo: async (parent, args, { token, supportsWebP, dataSources: { videoAPI } }) => {
      const { input } = args;

      const creationPayload = Object.assign({}, input, {
        mediaType: MediaType.VIDEO,
        storageType: StorageType.LOCAL,
      }) ;

      const video = await videoAPI.createVideo(creationPayload, token);
      return Object.assign({}, video, buildThumbsAndImages(video, false, supportsWebP));
    },

    updateVideo: async (parent, args, { token, supportsWebP, dataSources: { videoAPI } }) => {
      const { id, input } = args;

      const updatePayload = Object.assign({}, input);

      const video = await videoAPI.updateVideo(id, updatePayload, token);
      return Object.assign({}, video, buildThumbsAndImages(video, false, supportsWebP));
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
    }
  }
};
