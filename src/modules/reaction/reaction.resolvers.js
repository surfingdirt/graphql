const { submitterResolver } = require('../../utils/users');

const getReactionResolvers = (tracer) => ({
  ReactionQueryResolvers: {
    listUserReactions: async (parent, args, { locale, token, dataSources: { reactionAPI } }, { span }) => {
      const reactions = await reactionAPI.setParentSpan(span).listUserReactions(token);
      return reactions;
    },
  },
  ReactionMutationResolvers: {
    createReaction: async (parent, args, { token, dataSources: { reactionAPI } }, { span }) => {
      const { input } = args;
      const reaction = await reactionAPI.setParentSpan(span).createReaction(input, token);
      return reaction;
    },

    deleteReaction: async (parent, args, { token, dataSources: { reactionAPI } }, { span }) => {
      const { id } = args;
      const response = await reactionAPI.setParentSpan(span).deleteReaction(id, token);
      return response.status;
    },
  },
  ReactionFieldResolvers: {
    submitter(parent, args, { token, dataSources: { imageAPI, userAPI } }, { span }) {
      return submitterResolver(parent, args, { token, dataSources: { imageAPI, userAPI } }, span);
    },

    // Perhaps here will be where we flesh out the response for listUserReactions children
  },
});

module.exports = getReactionResolvers;
