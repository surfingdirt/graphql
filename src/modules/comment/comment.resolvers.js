const { DataType } = require('../../constants');
const { submitterResolver } = require('../../utils/users');

const createComment = async (args, token, commentAPI, parentType) => {
  const { input } = args;
  const creationPayload = {
    content: input.content,
    itemId: input.parentId,
    itemType: parentType,
    status: input.status,
    tone: input.tone,
  };

  const comment = await commentAPI.createComment(creationPayload, token);
  return comment;
};

const getCommentResolvers = (tracer) => ({
  CommentQueryResolvers: {
    listComments: async (parent, args, { token, dataSources: { commentAPI } }, { span }) => {
      const comments = await commentAPI.setParentSpan(span).listComments(args.parentId, args.parentType, token);
      return comments;
    },
    comment: async (parent, args, { token, dataSources: { commentAPI } }, { span }) => {
      const comment = await commentAPI.setParentSpan(span).getComment(args.id, token);
      return comment;
    },
  },
  CommentMutationResolvers: {
    createAlbumComment: async (parent, args, { token, dataSources: { commentAPI } }) => {
      return createComment(args, token, commentAPI, DataType.ALBUM);
    },

    createPhotoComment: async (parent, args, { token, dataSources: { commentAPI } }) => {
      return createComment(args, token, commentAPI, DataType.PHOTO);
    },

    createVideoComment: async (parent, args, { token, dataSources: { commentAPI } }) => {
      return createComment(args, token, commentAPI, DataType.VIDEO);
    },

    updateComment: async (parent, args, { token, dataSources: { commentAPI } }) => {
      const { id, input } = args;

      let updatePayload = Object.assign({}, input);

      const comment = await commentAPI.updateComment(id, updatePayload, token);
      return comment;
    },

    deleteComment: async (parent, args, { token, dataSources: { commentAPI } }) => {
      const { id } = args;

      const response = await commentAPI.deleteComment(id, token);
      return response.status;
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
});

module.exports = getCommentResolvers;
