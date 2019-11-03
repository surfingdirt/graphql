const Comment = require("./comment.type");
const CommentAPI = require("./comment.api");
const {
  CommentTypeResolvers,
  CommentFieldResolvers,
  CommentMutationResolvers,
  CommentQueryResolvers
} = require("./comment.resolvers");

module.exports = {
  Comment,
  CommentAPI,
  CommentTypeResolvers,
  CommentFieldResolvers,
  CommentMutationResolvers,
  CommentQueryResolvers
};
