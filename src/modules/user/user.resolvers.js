module.exports = {
  UserQueryResolvers: {
    user: (parent, args, { token, dataSources: { userAPI } }) => {
      return userAPI.getUser(args.userId, token);
    }
  },
  UserMutationResolvers: {
    createUser: async (parent, args, { token, dataSources: { userAPI } }) => {
      const { input } = args;
      const user = await userAPI.createUser(input, token);
      return user;
    },

    updateUser: async (parent, args, { token, dataSources: { userAPI } }) => {
      const { userId, input } = args;
      const user = await userAPI.updateUser(userId, input, token);
      return user;
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
  }
};
