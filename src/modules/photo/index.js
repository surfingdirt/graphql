const Photo = require("./photo.type");
const {
  PhotoTypeResolvers,
  PhotoFieldResolvers,
  PhotoMutationResolvers,
  PhotoQueryResolvers
} = require("./photo.resolvers");

module.exports = {
  Photo,
  PhotoTypeResolvers,
  PhotoFieldResolvers,
  PhotoMutationResolvers,
  PhotoQueryResolvers
};
