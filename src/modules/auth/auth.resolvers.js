const login = (
  parent,
  args,
  context
) => {
  const { input: { username, userP } } = args;
  const { dataSources: { authAPI } } = context;
  return authAPI.login(username, userP);
};

const logout = (parent, args, { token, dataSources: { authAPI } }) => {
  return authAPI.logout(token);
}

module.exports = {
  login,
  logout
};
