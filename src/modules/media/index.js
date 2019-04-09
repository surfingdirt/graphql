const MediaAPI = require('./media.api');
const { Media } = require('./media.type');
const { getMedia } = require('./media.resolvers');

module.exports = {
  Media,
  MediaAPI,
  MediaQueryResolvers: { getMedia },
};
