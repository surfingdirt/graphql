require('dotenv').config({ path: './config/.env' });

const { port } = require('../config');
const { server, graphqlServer } = require('./server');

if (!process.env.FACEBOOK_ACCESS_TOKEN) {
  throw new Error('FACEBOOK_ACCESS_TOKEN not set - aborting');
}

server.listen({ port }, () =>
  console.log(`Surfing Dirt GraphQL server ready at http://localhost:${port}${graphqlServer.graphqlPath}`),
);
