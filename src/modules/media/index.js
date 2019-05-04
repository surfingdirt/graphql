const MediaAPI = require('./media.api');
const Media = require('./media.type');
const {MediaTypeResolvers, MediaFieldResolvers, MediaMutationResolvers, MediaQueryResolvers} = require('./media.resolvers');

module.exports = {
  Media,
  MediaAPI,
  MediaTypeResolvers,
  MediaFieldResolvers,
  MediaMutationResolvers,
  MediaQueryResolvers,
};
