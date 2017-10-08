(function (app) {
  'use strict';

  app.registerModule('root.microapps', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('root.microapps.admin', ['core.admin']);
  app.registerModule('root.microapps.admin.routes', ['core.admin.routes']);
  app.registerModule('root.microapps.services');
  app.registerModule('root.microapps.routes', ['ui.router', 'core.routes', 'root.microapps.services']);
}(ApplicationConfiguration));
