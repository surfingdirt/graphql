const VideoAPI = require("./video.api");
const Video = require("./video.type");
const {
  VideoTypeResolvers,
  VideoFieldResolvers,
  VideoMutationResolvers,
  VideoQueryResolvers
} = require("./video.resolvers");

module.exports = {
  Video,
  VideoAPI,
  VideoTypeResolvers,
  VideoFieldResolvers,
  VideoMutationResolvers,
  VideoQueryResolvers
};
