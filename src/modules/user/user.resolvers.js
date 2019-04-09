const getUser = (parent, args, { token, dataSources: { userAPI } }) => {
  return userAPI.getUser(args.userId, token);
};

module.exports = {
  getUser
};
