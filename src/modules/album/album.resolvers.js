const { AlbumContributions, AlbumVisibility, MediaType } = require('../../constants');
const { buildThumbsAndImages } = require('../../utils/thumbs');
const { submitterResolver } = require('../../utils/users');
const { getVendorUrl, getEmbedUrl } = require('../../utils/videoUtils');

const getFullMedia = (m) => {
  let videoProps = {};
  if (m.mediaType === MediaType.VIDEO) {
    videoProps = {
      embedUrl: getEmbedUrl(m),
      vendorUrl: getVendorUrl(m),
    };
  }
  return Object.assign({}, m, buildThumbsAndImages(m, m.mediaType == MediaType.PHOTO), videoProps);
};

const DEFAULT_ALBUM_PREVIEW_ITEM_COUNT = 5;
const DEFAULT_ALBUM_ITEM_COUNT = 20;
const DEFAULT_ALBUM_COUNT = 10;
const DEFAULT_ALBUM_SORT = null;
const DEFAULT_ALBUM_DIR = 'desc';

module.exports = {
  AlbumQueryResolvers: {
    album: async (parent, args, { token, dataSources: { albumAPI } }) => {
      const countItems = args.countItems || DEFAULT_ALBUM_ITEM_COUNT;
      const startItem = args.startItem || 0;
      const album = await albumAPI.getAlbum(args.id, token, countItems, startItem);
      const fullMedia = album.media.map((m) => getFullMedia(m));
      return Object.assign({}, album, { media: fullMedia });
    },

    listMedia: async (parent, args, { token, dataSources: { albumAPI } }) => {
      const countItems = args.countItems || DEFAULT_ALBUM_ITEM_COUNT;
      const startItem = args.startItem || 0;
      const album = await albumAPI.getAlbum(args.albumId, token, countItems, startItem);
      const fullMedia = album.media.map((m) => getFullMedia(m));
      return fullMedia;
    },

    listAlbums: async (parent, args, { token, dataSources: { albumAPI } }) => {
      const fullAlbums = [];

      const countItems = args.countItems || DEFAULT_ALBUM_PREVIEW_ITEM_COUNT;
      const count = args.count || DEFAULT_ALBUM_COUNT;
      const start = args.start || 0;
      const sort = args.sort || DEFAULT_ALBUM_SORT;
      const dir = args.dir || DEFAULT_ALBUM_DIR;
      const skipAlbums = args.skipAlbums || [];
      const albums = await albumAPI.listAlbums(
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

    async lastEditor(parent, args, { token, dataSources: { userAPI } }) {
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.getUser(parent.lastEditor.id, token);
    },

    submitter(parent, args, { token, dataSources: { imageAPI, userAPI } }) {
      return submitterResolver(parent, args, { token, dataSources: { imageAPI, userAPI } });
    },
  },
  AlbumMutationResolvers: {
    async createAlbum(parent, args, { token, dataSources: { albumAPI } }) {
      const { input } = args;

      const album = await albumAPI.createAlbum(input, token);
      return album;
    },
  },
};
