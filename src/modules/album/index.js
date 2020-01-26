const AlbumAPI = require("./album.api");
const Album = require("./album.type");
const getAlbumResolvers = require("./album.resolvers");

module.exports = {
  Album,
  AlbumAPI,
  getAlbumResolvers,
};
