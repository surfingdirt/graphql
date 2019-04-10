module.exports = {
  MediaQueryResolvers: {
    media: async (
      parent,
      args,
      { token, dataSources: { mediaAPI, userAPI } }
    ) => {
      const media = await mediaAPI.getMedia(args.id, token);
      const submitter = media.submitter.id
        ? await userAPI.getUser(media.submitter.id, token)
        : null;

      return Object.assign({}, media, { submitter });
    }
  },
  MediaFieldResolvers: {
    async album(
      parent,
      args,
      {
        token,
        dataSources: { albumAPI }
      }
    ) {
      if (!parent.album.id) {
        return null;
      }
      return await albumAPI.getAlbum(parent.album.id, token);
    },

    async lastEditor(
      parent,
      args,
      {
        token,
        dataSources: { userAPI }
      }
    ) {
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.getUser(parent.lastEditor.id, token);
    },

    async users(
      parent,
      args,
      {
        token,
        dataSources: { userAPI }
      }
    ) {
      const users = [];
      for (let userId of parent.users) {
        users.push(await userAPI.getUser(userId, token));
      }
      return users;
    }
  }
};
