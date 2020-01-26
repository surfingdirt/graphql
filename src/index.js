const { port } = require('../config');
const { server, graphqlServer } = require('./server');

server.listen({ port }, () =>
  console.log(`Surfing Dirt GraphQL server ready at http://localhost:${port}${graphqlServer.graphqlPath}`),
);
