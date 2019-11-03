const { MediaType, StorageType } = require('../../constants');
const { storeImageOnLocalAPI } = require('../../utils/RestAPI');
const { buildThumbsAndImages } = require('../../utils/thumbs');
const { submitterResolver } = require('../../utils/users');

module.exports = {
  CommentTypeResolvers: {},
  CommentQueryResolvers: {
    listComments: async (parent, args, { token, dataSources: { commentAPI } }) => {
      const comments = await commentAPI.listComments(args.parentId, args.parentType, token);
      return comments;
    },
    comment: async (parent, args, { token, dataSources: { commentAPI } }) => {
      const comment = await commentAPI.getComment(args.id, token);
      return comment;
    },
  },
  CommentMutationResolvers: {
    createComment: async (parent, args, { token, dataSources: { mediaAPI } }) => {
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

    updateComment: async (parent, args, { token, dataSources: { mediaAPI } }) => {
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
  CommentFieldResolvers: {
    async lastEditor(parent, args, { token, dataSources: { userAPI } }) {
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.getUser(parent.lastEditor.id, token);
    },

    submitter(parent, args, { token, dataSources: { imageAPI, userAPI } }) {
      return submitterResolver(parent, args, { token, dataSources: { imageAPI, userAPI } });
    },
  },
};
