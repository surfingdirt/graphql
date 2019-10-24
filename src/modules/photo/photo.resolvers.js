const { MediaType, StorageType } = require('../../constants');
const { storeImageOnLocalAPI } = require('../../utils/RestAPI');
const { buildThumbsAndImages } = require('../../utils/thumbs');

module.exports = {
  PhotoTypeResolvers: {},
  PhotoQueryResolvers: {
    photo: async (parent, args, { token, dataSources: { mediaAPI, userAPI } }) => {
      const photo = await mediaAPI.getMedia(args.id, token);
      const submitter = photo.submitter.id
        ? await userAPI.getUser(photo.submitter.id, token)
        : null;

      return Object.assign(
        {},
        photo,
        { submitter, mediaType: MediaType.PHOTO },
        buildThumbsAndImages(photo, true),
      );
    },
  },
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
  PhotoFieldResolvers: {
    async album(parent, args, { token, dataSources: { albumAPI } }) {
      if (!parent.album.id) {
        return null;
      }
      return await albumAPI.getAlbum(parent.album.id, token);
    },

    async lastEditor(parent, args, { token, dataSources: { userAPI } }) {
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.getUser(parent.lastEditor.id, token);
    },

    async users(parent, args, { token, dataSources: { userAPI } }) {
      const users = [];
      for (let userId of parent.users) {
        users.push(await userAPI.getUser(userId, token));
      }
      return users;
    },
  },
};
