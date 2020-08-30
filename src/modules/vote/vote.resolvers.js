const { submitterResolver } = require('../../utils/users');

const getVoteResolvers = (tracer) => ({
  VoteQueryResolvers: {
    getSurveyVote: async (parent, args, { locale, token, dataSources: { voteAPI } }, { span }) => {
      const { surveyId } = args;
      const vote = await voteAPI.setParentSpan(span).getVote(surveyId, token);
      return vote;
    },
  },
  VoteMutationResolvers: {
    castVote: async (parent, args, { token, dataSources: { voteAPI } }, { span }) => {
      const { input } = args;
      const reaction = await voteAPI.setParentSpan(span).castVote(input, token);
      return reaction;
    },
  },
});

module.exports = getVoteResolvers;
