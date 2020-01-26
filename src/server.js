const express = require('express');

const aliveRoute = require('./alive/alive.route');
const graphqlBuilder = require('./graphqlBuilder');

const server = express();
server.disable('x-powered-by');

server.post('/*', (req, res, next) => {
  res.header('Last-Modified', new Date());
  next();
});

server.get('/*', (req, res, next) => {
  res.header('Last-Modified', new Date());
  next();
});

aliveRoute(server);

const graphqlServer = graphqlBuilder();
graphqlServer.applyMiddleware({ app: server, path: '/' });

module.exports = {
  server,
  graphqlServer,
};
