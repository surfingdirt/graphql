const {port} = require('../config');

const { app, graphql } = require('./app');

app.listen({ port }, () =>
  console.log(`Surfing Dirt GraphQL server ready at http://localhost:${port}${graphql.graphqlPath}`),
);
