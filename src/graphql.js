const { ApolloServer } = require("apollo-server-express");

const { Query, BaseQueryResolvers } = require("./modules/base");
const typeDefs = [Query];

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    ...BaseQueryResolvers
  },
};

const dataSources = () => ({
});

const buildGraphQLServer = () =>
  new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
  });

module.exports = {
  buildGraphQLServer
};
