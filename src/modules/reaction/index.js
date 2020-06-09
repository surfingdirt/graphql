const Reaction = require("./reaction.type");
const ReactionAPI = require("./reaction.api");
const getReactionResolvers = require("./reaction.resolvers");

const getFormattedReactions = (reactions) => Object.entries(reactions).map(
  ( [type, { count, userReactionId }]) => ({type, count, userReactionId })
);

module.exports = {
  Reaction,
  ReactionAPI,
  getReactionResolvers,
  getFormattedReactions,
};
