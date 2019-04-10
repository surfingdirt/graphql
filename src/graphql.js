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
  MediaQueryResolvers,
  MediaFieldResolvers
} = require("./modules/media");

const { User, UserAPI, UserFieldResolvers, UserQueryResolvers } = require("./modules/user");

/******************************************************************************
 * TYPEDEFS
 *****************************************************************************/
const typeDefs = [BaseTypes, Album, Auth /*, Image*/, Media, User];

/******************************************************************************
 * RESOLVERS
 *****************************************************************************/
const resolvers = {
  Query: {
    ...BaseQueryResolvers,
    ...AlbumQueryResolvers,
    ...MediaQueryResolvers,
    ...UserQueryResolvers
  },

  Mutation: {
    ...AuthMutationResolvers
  },

  Album: { ...AlbumFieldResolvers },

  Media: { ...MediaFieldResolvers },

  User: { ...UserFieldResolvers },
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
const buildGraphQLServer = () =>
  new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      return { token };
    }
  });

module.exports = {
  buildGraphQLServer
};
