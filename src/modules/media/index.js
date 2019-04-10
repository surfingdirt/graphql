const MediaAPI = require('./media.api');
const Media = require('./media.type');
const {MediaFieldResolvers, MediaQueryResolvers} = require('./media.resolvers');

module.exports = {
  Media,
  MediaAPI,
  MediaFieldResolvers,
  MediaQueryResolvers,
};
