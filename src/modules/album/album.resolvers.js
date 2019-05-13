const { MediaType } = require('../../constants');
const { buildThumbsAndImages } = require('../../utils/thumbs');

module.exports = {
  AlbumQueryResolvers: {
    album: async (parent, args, { token, supportsWebP, dataSources: { albumAPI, userAPI } }) => {
      const album = await albumAPI.getAlbum(args.id, token);
      // return album;
      const fullMedia = album.media.map(async (m) => {
        const submitter = m.submitter.id ? await userAPI.getUser(m.submitter.id, token) : null;
        const lastEditor = m.lastEditor.id ? await userAPI.getUser(m.lastEditor.id, token) : null;
        return Object.assign(
          {},
          m,
          { submitter, lastEditor },
          buildThumbsAndImages(m, m.mediaType == MediaType.PHOTO, supportsWebP),
        );
      });

      return Object.assign({}, album, { media: fullMedia });
    },
  },
  AlbumFieldResolvers: {
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
};
