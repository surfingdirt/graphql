const login = (parent, args, context) => {
  const {
    input: { username, userP },
  } = args;
  const {
    dataSources: { authAPI },
  } = context;
  return authAPI.login(username, userP);
};

const logout = async (parent, args, { token, dataSources: { authAPI } }) => {
  await authAPI.logout(token);
  return true;
};

module.exports = {
  login,
  logout,
};
