const { ApolloServer } = require("apollo-server-express");

const { BaseTypes, BaseQueryResolvers } = require("./modules/base");
const {
  Album,
  AlbumAPI,
  AlbumQueryResolvers,
} = require("./modules/album");

const {
  Auth,
  AuthAPI,
  AuthMutationResolvers,
} = require("./modules/auth");

// const {
//   Image,
//   ImageAPI,
//   ImageMutationResolvers,
// } = require("./modules/image");

const {
  Media,
  MediaAPI,
  MediaQueryResolvers,
} = require("./modules/media");

const {
  User,
  UserAPI,
  UserQueryResolvers,
} = require("./modules/user");

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
    ...UserQueryResolvers,
  },
  Mutation: {
    ...AuthMutationResolvers,
    // ...ImageMutationResolvers,
  },
  Album: {
    async lastEditor(parent, args, { token, dataSources: { userAPI } }) {
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.getUser(parent.lastEditor.id, token);
    },

    async submitter(parent, args, { token, dataSources: { userAPI } }) {
      if (!parent.submitter.id) {
        return null;
      }
      return await userAPI.getUser(parent.submitter.id, token);
    },
  },

  Media: {
    async album(parent, args, { token, dataSources: { albumAPI } }) {
      if (!parent.album.id) {
        return null;
      }
      return await albumAPI.getAlbum(parent.album.id, token);
    },

    async lastEditor(parent, args, { token, dataSources: { userAPI } }) {
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.getUser(parent.lastEditor.id, token);
    },

    async users(parent, args, { token, dataSources: { userAPI } }) {
      const users = [];
      for (let userId of parent.users) {
        users.push(await userAPI.getUser(userId, token));
      }
      return users;
    },
  },

  User: {
    async album(parent, args, { token, dataSources: { albumAPI } }) {
      if (!parent.album.id) {
        return null;
      }
      return await albumAPI.getAlbum(parent.album.id, token);
    },
  }

};

/******************************************************************************
 * DATA SOURCES
 *****************************************************************************/
const dataSources = () => ({
  albumAPI: new AlbumAPI(),
  authAPI: new AuthAPI(),
  // imageAPI: new ImageAPI(),
  mediaAPI: new MediaAPI(),
  userAPI: new UserAPI(),
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
      const token = req.headers.authorization || '';
      return { token };
    },
  });

module.exports = {
  buildGraphQLServer
};
