const PhotoAPI = require("./photo.api");
const Photo = require("./photo.type");
const {
  PhotoTypeResolvers,
  PhotoFieldResolvers,
  PhotoMutationResolvers,
  PhotoQueryResolvers
} = require("./photo.resolvers");

module.exports = {
  Photo,
  PhotoAPI,
  PhotoTypeResolvers,
  PhotoFieldResolvers,
  PhotoMutationResolvers,
  PhotoQueryResolvers
};
