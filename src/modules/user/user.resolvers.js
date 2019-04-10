module.exports = {
  user: (parent, args, { token, dataSources: { userAPI } }) => {
    return userAPI.getUser(args.userId, token);
  }
};
