const { ApolloServer } = require('apollo-server-express');
const OpentracingExtension = require("apollo-opentracing").default;

const { Album, AlbumAPI, getAlbumResolvers } = require('./modules/album');
const { Auth, AuthAPI, getAuthResolvers } = require('./modules/auth');
const { BaseTypes, getBaseResolvers } = require('./modules/base');
const { Comment, CommentAPI, getCommentResolvers, } = require('./modules/comment');
const { Media, MediaAPI, getMediaResolvers } = require('./modules/media');
const { Image, ImageAPI } = require('./modules/image');
const { Photo, getPhotoResolvers, } = require('./modules/photo');
const { Video, getVideoResolvers, } = require('./modules/video');
const { User, UserAPI, getUserResolvers, } = require('./modules/user');

const graphqlBuilder = (localTracer, serverTracer) => {
  /******************************************************************************
   * TYPEDEFS
   *****************************************************************************/
  const typeDefs = [BaseTypes, Album, Auth, Comment, Image, Media, Photo, Video, User];

  /******************************************************************************
   * RESOLVERS
   *****************************************************************************/
  const { AlbumFieldResolvers, AlbumQueryResolvers, AlbumMutationResolvers } = getAlbumResolvers(localTracer);
  const { AuthMutationResolvers } = getAuthResolvers(localTracer);
  const { BaseQueryResolvers } = getBaseResolvers(localTracer);
  const { CommentFieldResolvers, CommentMutationResolvers, CommentQueryResolvers } = getCommentResolvers(localTracer);
  const { MediaFieldResolvers, MediaQueryResolvers, MediaTypeResolvers } = getMediaResolvers(localTracer);
  const { PhotoMutationResolvers } = getPhotoResolvers(localTracer);
  const { VideoMutationResolvers, VideoQueryResolvers, } = getVideoResolvers(localTracer);
  const { UserFieldResolvers, UserMutationResolvers, UserQueryResolvers, } = getUserResolvers(localTracer);

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
    albumAPI: new AlbumAPI(localTracer),
    commentAPI: new CommentAPI(localTracer),
    authAPI: new AuthAPI(localTracer),
    imageAPI: new ImageAPI(localTracer),
    mediaAPI: new MediaAPI(localTracer),
    userAPI: new UserAPI(localTracer),
  });

  /******************************************************************************
   * GRAPHQL SERVER
   *****************************************************************************/
  return new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    extensions: [() => new OpentracingExtension({
      server: serverTracer,
      local: localTracer,
    })],
    formatError: (err) => {
      console.log('==================================');
      console.log('Error:');
      console.log(JSON.stringify(err, null, 2));
      console.log('==================================');
      return err;
    },
    context: ({ req }) => {
      console.log('--------------------------------------------------------------------------------');
      console.log('Request body:');
      console.log(req.body);
      console.log('--------------------------------------------------------------------------------');

      const token = req.headers.authorization || '';
      return { token };
    },
  });
};
module.exports = graphqlBuilder;
