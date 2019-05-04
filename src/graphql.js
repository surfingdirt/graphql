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
  MediaAPI,
  MediaTypeResolvers,
  MediaQueryResolvers,
  MediaMutationResolvers,
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
const typeDefs = [BaseTypes, Album, Auth /*, Image*/, Media, Photo, Video, User];

/******************************************************************************
 * RESOLVERS
 *****************************************************************************/
const resolvers = {
  Query: {
    ...BaseQueryResolvers,
    ...AlbumQueryResolvers,
    ...MediaQueryResolvers,
    ...PhotoQueryResolvers,
    ...VideoQueryResolvers,
    ...UserQueryResolvers
  },

  Mutation: {
    ...AuthMutationResolvers,
    ...MediaMutationResolvers,
    ...PhotoMutationResolvers,
    ...VideoMutationResolvers,
    ...UserMutationResolvers,
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
  mediaAPI: new MediaAPI(),
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
      return { token };
    },
  });

module.exports = {
  buildGraphQLServer
};
