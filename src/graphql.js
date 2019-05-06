const { ApolloServer } = require("apollo-server-express");

const { BaseTypes, BaseQueryResolvers } = require("./modules/base");
const {
  Album,
  AlbumAPI,
  AlbumFieldResolvers,
  AlbumQueryResolvers
} = require("./modules/album");

const { Auth, AuthAPI, AuthMutationResolvers } = require("./modules/auth");

const {
  Media,
  MediaTypeResolvers,
  MediaFieldResolvers
} = require("./modules/media");

const {
  Photo,
  PhotoAPI,
  PhotoTypeResolvers,
  PhotoQueryResolvers,
  PhotoMutationResolvers,
  PhotoFieldResolvers
} = require("./modules/photo");

const {
  Video,
  VideoAPI,
  VideoTypeResolvers,
  VideoQueryResolvers,
  VideoMutationResolvers,
  VideoFieldResolvers
} = require("./modules/video");

const {
  User,
  UserAPI,
  UserFieldResolvers,
  UserMutationResolvers,
  UserQueryResolvers
} = require("./modules/user");

/******************************************************************************
 * TYPEDEFS
 *****************************************************************************/
const typeDefs = [
  BaseTypes,
  Album,
  Auth /*, Image*/,
  Media,
  Photo,
  Video,
  User
];

/******************************************************************************
 * RESOLVERS
 *****************************************************************************/
const resolvers = {
  Query: {
    ...BaseQueryResolvers,
    ...AlbumQueryResolvers,
    ...PhotoQueryResolvers,
    ...VideoQueryResolvers,
    ...UserQueryResolvers
  },

  Mutation: {
    ...AuthMutationResolvers,
    ...PhotoMutationResolvers,
    ...VideoMutationResolvers,
    ...UserMutationResolvers
  },

  Album: { ...AlbumFieldResolvers },

  ...MediaTypeResolvers,
  ...PhotoTypeResolvers,
  ...VideoTypeResolvers,

  Media: { ...MediaFieldResolvers },
  Photo: { ...PhotoFieldResolvers },
  Video: { ...VideoFieldResolvers },

  User: { ...UserFieldResolvers }
};

/******************************************************************************
 * DATA SOURCES
 *****************************************************************************/
const dataSources = () => ({
  albumAPI: new AlbumAPI(),
  authAPI: new AuthAPI(),
  photoAPI: new PhotoAPI(),
  videoAPI: new VideoAPI(),
  userAPI: new UserAPI()
});

/******************************************************************************
 * SERVER
 *****************************************************************************/
const buildGraphQLServer = () =>
  new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const supportsWebP = req.headers.accept.indexOf("image/webp") !== -1;
      return { token, supportsWebP };
    }
  });

module.exports = {
  buildGraphQLServer
};
