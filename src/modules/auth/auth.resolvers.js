const login = (
  root,
  { input: { username, userP } },
  { dataSources: { authAPI } }
) => {
  return authAPI.login(username, userP);
};

const logout = (root, args, { dataSources: { authAPI } }) =>
  authAPI.logout(args);

module.exports = {
  login,
  logout
};
