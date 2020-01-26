const { ApolloServer } = require('apollo-server-express');

const { Album, AlbumAPI, getAlbumResolvers } = require('./modules/album');
const { Auth, AuthAPI, getAuthResolvers } = require('./modules/auth');
const { BaseTypes, getBaseResolvers } = require('./modules/base');
const { Comment, CommentAPI, getCommentResolvers, } = require('./modules/comment');
const { Media, MediaAPI, getMediaResolvers } = require('./modules/media');
const { Image, ImageAPI } = require('./modules/image');
const { Photo, getPhotoResolvers, } = require('./modules/photo');
const { Video, getVideoResolvers, } = require('./modules/video');
const { User, UserAPI, getUserResolvers, } = require('./modules/user');

const graphqlBuilder = (tracer) => {
  /******************************************************************************
   * TYPEDEFS
   *****************************************************************************/
  const typeDefs = [BaseTypes, Album, Auth, Comment, Image, Media, Photo, Video, User];

  /******************************************************************************
   * RESOLVERS
   *****************************************************************************/
  const { AlbumFieldResolvers, AlbumQueryResolvers, AlbumMutationResolvers } = getAlbumResolvers(tracer);
  const { AuthMutationResolvers } = getAuthResolvers(tracer);
  const { BaseQueryResolvers } = getBaseResolvers(tracer);
  const { CommentFieldResolvers, CommentMutationResolvers, CommentQueryResolvers } = getCommentResolvers(tracer);
  const { MediaFieldResolvers, MediaQueryResolvers, MediaTypeResolvers } = getMediaResolvers(tracer);
  const { PhotoMutationResolvers } = getPhotoResolvers(tracer);
  const { VideoMutationResolvers, VideoQueryResolvers, } = getVideoResolvers(tracer);
  const { UserFieldResolvers, UserMutationResolvers, UserQueryResolvers, } = getUserResolvers(tracer);

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
    albumAPI: new AlbumAPI(tracer),
    commentAPI: new CommentAPI(tracer),
    authAPI: new AuthAPI(tracer),
    imageAPI: new ImageAPI(tracer),
    mediaAPI: new MediaAPI(tracer),
    userAPI: new UserAPI(tracer),
  });

  /******************************************************************************
   * GRAPHQL SERVER
   *****************************************************************************/
  return new ApolloServer({
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
      console.log('--------------------------------------------------------------------------------');
      console.log('Request body:');
      console.log(req.body);
      console.log('--------------------------------------------------------------------------------');

      // TODO: start a span here and possibly link it to a parent span
      const token = req.headers.authorization || '';
      return { token };
    },
  });
};
module.exports = graphqlBuilder;
