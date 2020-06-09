const { AlbumContributions, AlbumVisibility, MediaType } = require('../../constants');
const { getFormattedReactions } = require('../reaction');
const { submitterResolver } = require('../../utils/users');
const { getFullMedia } = require('../../utils/albumUtils');
const { findContentVersionForLocale } = require('../../utils/language');

const DEFAULT_ALBUM_PREVIEW_ITEM_COUNT = 5;
const DEFAULT_ALBUM_ITEM_COUNT = 20;
const DEFAULT_ALBUM_COUNT = 10;
const DEFAULT_ALBUM_SORT = null;
const DEFAULT_ALBUM_DIR = 'desc';

const getAlbumResolvers = (tracer) => ({
  AlbumQueryResolvers: {
    album: async (parent, args, { token, dataSources: { albumAPI } }, { span }) => {
      const countItems = args.countItems || DEFAULT_ALBUM_ITEM_COUNT;
      const startItem = args.startItem || 0;
      const album = await albumAPI.setParentSpan(span).getAlbum(args.id, token, countItems, startItem);
      const fullMedia = album.media.map((m) => getFullMedia(m));
      return Object.assign({}, album, { media: fullMedia });
    },

    listMedia: async (parent, args, { token, dataSources: { albumAPI } }, { span }) => {
      const countItems = args.countItems || DEFAULT_ALBUM_ITEM_COUNT;
      const startItem = args.startItem || 0;
      const album = await albumAPI.setParentSpan(span).getAlbum(args.albumId, token, countItems, startItem);
      const fullMedia = album.media.map((m) => getFullMedia(m));
      return fullMedia;
    },

    listAlbums: async (parent, args, { token, dataSources: { albumAPI } }, { span }) => {
      const fullAlbums = [];

      const countItems = args.countItems || DEFAULT_ALBUM_PREVIEW_ITEM_COUNT;
      const count = args.count || DEFAULT_ALBUM_COUNT;
      const start = args.start || 0;
      const sort = args.sort || DEFAULT_ALBUM_SORT;
      const dir = args.dir || DEFAULT_ALBUM_DIR;
      const skipAlbums = args.skipAlbums || [];
      const albums = await albumAPI.setParentSpan(span).listAlbums(
        args.userId,
        token,
        countItems,
        count,
        start,
        sort,
        dir,
        skipAlbums,
      );
      albums.forEach((album) => {
        const fullMediaList = album.media.map((m) => getFullMedia(m));
        fullAlbums.push(Object.assign({}, album, { media: fullMediaList }));
      });
      return fullAlbums;
    },
  },
  AlbumFieldResolvers: {
    albumContributions(parent) {
      switch (parent.albumContributions) {
        case AlbumContributions.PUBLIC:
          return 'PUBLIC';
        case AlbumContributions.PRIVATE:
          return 'PRIVATE';
        default:
          throw new Error(`Unhandled albumContributions '${parent.albumContributions}'`);
      }
    },

    albumVisibility(parent) {
      switch (parent.albumVisibility) {
        case AlbumVisibility.PRIVATE:
          return 'PRIVATE';
        case AlbumVisibility.VISIBLE:
          return 'VISIBLE';
        case AlbumVisibility.UNLISTED:
          return 'UNLISTED';
        default:
          throw new Error(`Unhandled albumVisibility '${parent.albumVisibility}'`);
      }
    },

    async lastEditor(parent, args, { token, dataSources: { userAPI } }, { span }) {
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.setParentSpan(span).getUser(parent.lastEditor.id, token);
    },

    submitter(parent, args, { token, dataSources: { imageAPI, userAPI } }, { span }) {
      return submitterResolver(parent, args, { token, dataSources: { imageAPI, userAPI } }, span);
    },

    description(parent, args, { locale }) {
      const translated = findContentVersionForLocale(parent.description, locale);
      return translated;
    },

    reactions(parent, args, { token }, { span }) {
      return getFormattedReactions(parent.reactions);
    },

    title(parent, args, { locale }) {
      const translated = findContentVersionForLocale(parent.title, locale);
      return translated;
    },
  },
  AlbumMutationResolvers: {
    async createAlbum(parent, args, { token, dataSources: { albumAPI } }, { span }) {
      const { input } = args;

      const album = await albumAPI.setParentSpan(span).createAlbum(input, token);
      return album;
    },

    updateAlbum: async (parent, args, { token, dataSources: { albumAPI } }, { span }) => {
      const { id, input } = args;

      let updatePayload = Object.assign({}, input);

      const response = await albumAPI.setParentSpan(span).updateAlbum(id, updatePayload, token);
      return response;
    },

    deleteAlbum: async (parent, args, { token, dataSources: { albumAPI } }, { span }) => {
      const response = await albumAPI.setParentSpan(span).deleteAlbum(args.id, token);
      return response.status;
    },
  },
});

module.exports = getAlbumResolvers;
