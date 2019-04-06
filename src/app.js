const express = require('express');

const aliveRoute = require('./alive/alive.route');

const { buildGraphQLServer } = require('./graphql');

const app = express();
app.disable('x-powered-by');

app.post('/*', (req, res, next) => {
  res.header('Last-Modified', new Date());
  next();
});

app.get('/*', (req, res, next) => {
  res.header('Last-Modified', new Date());
  next();
});

aliveRoute(app);

const graphQLServer = buildGraphQLServer();
graphQLServer.applyMiddleware({ app, path: '/' });

module.exports = {
  app,
  graphQLServer,
};
