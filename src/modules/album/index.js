const AlbumAPI = require('./album.api');
const { Album } = require('./album.type');
const { getAlbum } = require('./album.resolvers');

module.exports = {
  Album,
  AlbumAPI,
  AlbumQueryResolvers: { getAlbum },
};
