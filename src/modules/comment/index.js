const Comment = require("./comment.type");
const CommentAPI = require("./comment.api");
const {
  CommentFieldResolvers,
  CommentMutationResolvers,
  CommentQueryResolvers
} = require("./comment.resolvers");

module.exports = {
  Comment,
  CommentAPI,
  CommentFieldResolvers,
  CommentMutationResolvers,
  CommentQueryResolvers
};
