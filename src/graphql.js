const { ApolloServer } = require("apollo-server-express");

const { BaseTypes, BaseQueryResolvers } = require("./modules/base");
const {
  Auth,
  AuthAPI,
  AuthMutationResolvers,
} = require("./modules/auth");

const {
  User,
  UserAPI,
  UserQueryResolvers,
} = require("./modules/user");

/******************************************************************************
 * TYPEDEFS
 *****************************************************************************/
const typeDefs = [BaseTypes, Auth, User];

/******************************************************************************
 * RESOLVERS
 *****************************************************************************/
const resolvers = {
  Query: {
    ...BaseQueryResolvers,
    ...UserQueryResolvers,
  },
  Mutation: {
    ...AuthMutationResolvers,
  }
};

/******************************************************************************
 * DATA SOURCES
 *****************************************************************************/
const dataSources = () => ({
  authAPI: new AuthAPI(),
  userAPI: new UserAPI(),
});

const buildGraphQLServer = () =>
  new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      return { token };
    },
  });

module.exports = {
  buildGraphQLServer
};
