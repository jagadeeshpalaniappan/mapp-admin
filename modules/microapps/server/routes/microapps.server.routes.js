'use strict';

/**
 * Module dependencies
 */
var articlesPolicy = require('../policies/microapps.server.policy'),
  microapps = require('../controllers/microapps.server.controller');

module.exports = function (app) {
  // MicroApps collection routes
  app.route('/api/microapps').all(articlesPolicy.isAllowed)
    .get(microapps.list)
    .post(microapps.create);

  // Single microapp routes
  app.route('/api/microapps/:microAppId').all(articlesPolicy.isAllowed)
    .get(microapps.read)
    .put(microapps.update)
    .delete(microapps.delete);

  // Finish by binding the microapp middleware
  app.param('microAppId', microapps.articleByID);
};
