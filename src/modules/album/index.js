const AlbumAPI = require("./album.api");
const Album = require("./album.type");
const {
  AlbumQueryResolvers,
  AlbumFieldResolvers
} = require("./album.resolvers");

module.exports = {
  Album,
  AlbumAPI,
  AlbumQueryResolvers,
  AlbumFieldResolvers
};
