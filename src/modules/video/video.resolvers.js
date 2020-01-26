const { MediaType, StorageType } = require('../../constants');
const { buildThumbsAndImages } = require('../../utils/thumbs');
const { getVideoInfo } = require('../../utils/videoUtils');

const getVideoResolvers = (tracer) => ({
  VideoMutationResolvers: {
    createVideo: async (parent, args, { token, dataSources: { mediaAPI } }) => {
      const { input } = args;

      const creationPayload = Object.assign({}, input, {
        mediaType: MediaType.VIDEO,
        storageType: StorageType.LOCAL,
      });

      const video = await mediaAPI.createMedia(creationPayload, token);
      return Object.assign({}, video, buildThumbsAndImages(video, false));
    },

    updateVideo: async (parent, args, { token, dataSources: { mediaAPI } }) => {
      const { id, input } = args;

      const updatePayload = Object.assign({}, input);

      const video = await mediaAPI.updateMedia(id, updatePayload, token);
      return Object.assign({}, video, buildThumbsAndImages(video, false));
    },
  },
  VideoQueryResolvers: {
    getVideoInfo: async (parent, args, { token, dataSources: { videoAPI } }) => {
      const { url } = args;
      return getVideoInfo(url);
    },
  },
});

module.exports = getVideoResolvers;

