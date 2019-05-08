const Video = require("./video.type");
const {
  VideoTypeResolvers,
  VideoFieldResolvers,
  VideoMutationResolvers,
  VideoQueryResolvers
} = require("./video.resolvers");

module.exports = {
  Video,
  VideoTypeResolvers,
  VideoFieldResolvers,
  VideoMutationResolvers,
  VideoQueryResolvers
};
