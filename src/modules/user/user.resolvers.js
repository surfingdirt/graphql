module.exports = {
  UserQueryResolvers: {
    user: (parent, args, { token, dataSources: { userAPI } }) => {
      return userAPI.getUser(args.userId, token);
    }
  },
  UserFieldResolvers: {
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
    }
  },
};
