const { ApolloServer } = require('apollo-server-express');

const { BaseTypes, BaseQueryResolvers } = require('./modules/base');

const {
  Album,
  AlbumAPI,
  AlbumFieldResolvers,
  AlbumMutationResolvers,
  AlbumQueryResolvers,
} = require('./modules/album');

const {
  Comment,
  CommentAPI,
  CommentFieldResolvers,
  CommentMutationResolvers,
  CommentQueryResolvers,
} = require('./modules/comment');

const { Auth, AuthAPI, AuthMutationResolvers } = require('./modules/auth');

const { Image, ImageAPI } = require('./modules/image');

const { Media, MediaAPI, MediaTypeResolvers, MediaQueryResolvers, MediaFieldResolvers } = require('./modules/media');

const {
  Photo,
  PhotoMutationResolvers,
} = require('./modules/photo');

const {
  Video,
  VideoMutationResolvers,
  VideoQueryResolvers,
} = require('./modules/video');

const {
  User,
  UserAPI,
  UserFieldResolvers,
  UserMutationResolvers,
  UserQueryResolvers,
} = require('./modules/user');

/******************************************************************************
 * TYPEDEFS
 *****************************************************************************/
const typeDefs = [BaseTypes, Album, Auth, Comment, Image, Media, Photo, Video, User];

/******************************************************************************
 * RESOLVERS
 *****************************************************************************/
const resolvers = {
  Query: {
    ...BaseQueryResolvers,
    ...AlbumQueryResolvers,
    ...CommentQueryResolvers,
    ...MediaQueryResolvers,
    ...UserQueryResolvers,
    ...VideoQueryResolvers,
  },

  Mutation: {
    ...AlbumMutationResolvers,
    ...AuthMutationResolvers,
    ...CommentMutationResolvers,
    ...PhotoMutationResolvers,
    ...UserMutationResolvers,
    ...VideoMutationResolvers,
  },

  Album: { ...AlbumFieldResolvers },

  Comment: { ...CommentFieldResolvers },

  ...MediaTypeResolvers,

  Media: { ...MediaFieldResolvers },

  User: { ...UserFieldResolvers },
};

/******************************************************************************
 * DATA SOURCES
 *****************************************************************************/
const dataSources = () => ({
  albumAPI: new AlbumAPI(),
  commentAPI: new CommentAPI(),
  authAPI: new AuthAPI(),
  imageAPI: new ImageAPI(),
  mediaAPI: new MediaAPI(),
  userAPI: new UserAPI(),
});

/******************************************************************************
 * GRAPHQL SERVER
 *****************************************************************************/
const graphqlBuilder = () =>
  new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    formatError: (err) => {
      console.log('==================================');
      console.log('Error:');
      console.log(JSON.stringify(err, null, 2));
      console.log('==================================');
      return err;
    },
    context: ({ req }) => {
      console.log('++++++++++++++++++++++++++++++++++');
      console.log('Request body:');
      console.log(JSON.stringify(req.body, null, 2));
      console.log('++++++++++++++++++++++++++++++++++');
      const token = req.headers.authorization || '';
      return { token };
    },
  });

module.exports = graphqlBuilder;
