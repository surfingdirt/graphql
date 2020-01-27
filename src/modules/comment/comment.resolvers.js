const { DataType } = require('../../constants');
const { submitterResolver } = require('../../utils/users');

const createComment = async (args, token, commentAPI, parentType, span) => {
  const { input } = args;
  const creationPayload = {
    content: input.content,
    itemId: input.parentId,
    itemType: parentType,
    status: input.status,
    tone: input.tone,
  };

  const comment = await commentAPI.setParentSpan(span).createComment(creationPayload, token);
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
    createAlbumComment: async (parent, args, { token, dataSources: { commentAPI } }, { span }) => {
      return createComment(args, token, commentAPI, DataType.ALBUM, span);
    },

    createPhotoComment: async (parent, args, { token, dataSources: { commentAPI } }, { span }) => {
      return createComment(args, token, commentAPI, DataType.PHOTO, span);
    },

    createVideoComment: async (parent, args, { token, dataSources: { commentAPI } }, { span }) => {
      return createComment(args, token, commentAPI, DataType.VIDEO, span);
    },

    updateComment: async (parent, args, { token, dataSources: { commentAPI } }, { span }) => {
      const { id, input } = args;

      let updatePayload = Object.assign({}, input);

      const comment = await commentAPI.setParentSpan(span).updateComment(id, updatePayload, token);
      return comment;
    },

    deleteComment: async (parent, args, { token, dataSources: { commentAPI } }, { span }) => {
      const { id } = args;

      const response = await commentAPI.setParentSpan(span).deleteComment(id, token);
      return response.status;
    },
  },
  CommentFieldResolvers: {
    async lastEditor(parent, args, { token, dataSources: { userAPI } }, { span }) {
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.setParentSpan(span).getUser(parent.lastEditor.id, token);
    },

    submitter(parent, args, { token, dataSources: { imageAPI, userAPI } }, { span }) {
      return submitterResolver(parent, args, { token, dataSources: { imageAPI, userAPI } }, span);
    },
  },
});

module.exports = getCommentResolvers;
