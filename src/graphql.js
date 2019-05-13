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
  MediaFieldResolvers
} = require("./modules/media");

const {
  Photo,
  PhotoTypeResolvers,
  PhotoQueryResolvers,
  PhotoMutationResolvers,
  PhotoFieldResolvers
} = require("./modules/photo");

const {
  Video,
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
  mediaAPI: new MediaAPI(),
  userAPI: new UserAPI()
});

/******************************************************************************
 * SERVER
 *****************************************************************************/
const buildServer = () =>
  new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    formatError: (err) => {
      console.log("==================================");
      console.log(JSON.stringify(err, null, 2));
      console.log("==================================");
      return err;
    },
    context: ({ req }) => {
      console.log("++++++++++++++++++++++++++++++++++");
      console.log(JSON.stringify(req.body, null, 2));
      console.log("++++++++++++++++++++++++++++++++++");
      const token = req.headers.authorization || "";
      const supportsWebP = req.headers.accept.indexOf("image/webp") !== -1;
      return { token, supportsWebP };
    }
  });

module.exports = {
  buildServer
};
