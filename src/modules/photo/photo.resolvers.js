const { MediaType, StorageType } = require('../../constants');
const { storeImageOnLocalAPI } = require('../../utils/RestAPI');
const { buildThumbsAndImages } = require('../../utils/thumbs');

const getPhotoResolvers = (tracer) => ({
  PhotoMutationResolvers: {
    createPhoto: async (parent, args, { token, dataSources: { mediaAPI } }) => {
      const { input, file } = args;

      const imageData = await storeImageOnLocalAPI(file, token, true);

      const creationPayload = Object.assign({}, input, {
        imageId: imageData.key,
        mediaType: MediaType.PHOTO,
        storageType: StorageType.LOCAL,
      });

      const photo = await mediaAPI.createMedia(creationPayload, token);
      return Object.assign({}, photo, buildThumbsAndImages(photo, true));
    },

    updatePhoto: async (parent, args, { token, dataSources: { mediaAPI } }) => {
      const { id, input, file } = args;

      let updatePayload = Object.assign({}, input);
      if (file) {
        const imageData = await storeImageOnLocalAPI(file, token);
        updatePayload = Object.assign({}, input, {
          imageId: imageData.key,
        });
      }

      const photo = await mediaAPI.updateMedia(id, updatePayload, token);
      return Object.assign({}, photo, buildThumbsAndImages(photo, true));
    },
  },
});

module.exports = getPhotoResolvers;
