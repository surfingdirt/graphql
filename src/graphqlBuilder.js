const { ApolloServer } = require('apollo-server-express');
const OpentracingExtension = require("apollo-opentracing").default;
const languageParser = require("accept-language-parser");

const config = require('../config');

const { Album, AlbumAPI, getAlbumResolvers } = require('./modules/album');
const { Auth, AuthAPI, getAuthResolvers } = require('./modules/auth');
const { BaseTypes, getBaseResolvers } = require('./modules/base');
const { Comment, CommentAPI, getCommentResolvers, } = require('./modules/comment');
const { Media, MediaAPI, getMediaResolvers } = require('./modules/media');
const { Image, ImageAPI } = require('./modules/image');
const { Photo, getPhotoResolvers, } = require('./modules/photo');
const { Video, getVideoResolvers, } = require('./modules/video');
const { User, UserAPI, getUserResolvers, } = require('./modules/user');

const HEADER_TRACE_ID = 'x-b3-traceid';
const HEADER_PARENT_SPAN_ID = 'x-b3-parentspanid';
const HEADER_TRACE_FIELDS = 'x-b3-custom-tracefields';

const { alwaysDisabled, traceAll } = config.tracing;

const shouldTraceRequest = (info) => {
  const traceId = info.request.headers.get(HEADER_TRACE_ID);
  return traceAll.requests || !!traceId;
};

const shouldTraceFieldResolver = (parent, args, context, info) => {
  const { tracing: { traceId, traceFields } } = context;
  return traceAll.fields || (traceId && traceFields);
};

const graphqlBuilder = (localTracer, serverTracer) => {
  const extensions = [];
  if (!alwaysDisabled) {
    extensions.push(() => new OpentracingExtension({
      server: serverTracer,
      local: localTracer,
      shouldTraceRequest,
      shouldTraceFieldResolver,
    }));
  }

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
    extensions,
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
      const locale = languageParser.parse(req.headers['accept-language'] || '');

      const tracing = {
        traceId: req.headers[HEADER_TRACE_ID],
        parentSpanId: req.headers[HEADER_PARENT_SPAN_ID],
        traceFields: req.headers[HEADER_TRACE_FIELDS],
      };

      return { locale, token, tracing };
    },
  });
};
module.exports = graphqlBuilder;
