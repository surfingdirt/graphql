const login = async (parent, args, { dataSources: { authAPI } }, { span } ) => {
  const { input: { username, userP } } = args;
  const response = await authAPI.setParentSpan(span).login(username, userP);
  return response;
};
const loginOAuth = async (parent, args, { dataSources: { authAPI } }, { span } ) => {
  const { input: { token } } = args;
  const response = await authAPI.setParentSpan(span).loginOAuth(token);
  return response;
};

const logout = async (parent, args, { token, dataSources: { authAPI } }, { span }) => {
  await authAPI.setParentSpan(span).logout(token);
  return true;
};

const getAuthResolvers = (tracer) => ({
  AuthMutationResolvers: {
    login,
    loginOAuth,
    logout,
  },
});

module.exports = getAuthResolvers;
