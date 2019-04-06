const express = require('express');

const router = express.Router();

module.exports = (app) => {
  router.get('/alive', (req, res) => res.status(200).end());

  app.use('/', router);
};
