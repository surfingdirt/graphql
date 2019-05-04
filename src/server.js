const {port} = require('../config');

const { app, graphQLServer } = require('./app');

app.listen({ port }, () =>
  console.log(`Surfing Dirt GraphQL server ready at http://localhost:${port}${graphQLServer.graphqlPath}`),
);
