'use strict';

var validator = require('validator'),
  path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Render the main application page
 */

var _renderIndex = function (req, res) {

  // User is Authenticated ::

  var safeUserObject = {
    displayName: validator.escape(req.user.displayName),
    provider: validator.escape(req.user.provider),
    username: validator.escape(req.user.username),
    created: req.user.created.toString(),
    roles: req.user.roles,
    profileImageURL: req.user.profileImageURL,
    email: validator.escape(req.user.email),
    lastName: validator.escape(req.user.lastName),
    firstName: validator.escape(req.user.firstName),
    additionalProvidersData: req.user.additionalProvidersData
  };

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });


};


exports.renderIndex = function (req, res) {

  var magicKey = req.get('source-system');
  var isCalledByMicroAppFramework = magicKey && magicKey === 'SUPERMICROAPPFRAMEWORK' ? true : false;

  if (isCalledByMicroAppFramework) {

    if (req.user) {

      // SUCESS::
      //    -Request is Called By Micro App Framework
      //    -User is Authenticated
      _renderIndex(req, res);

    } else {

      // User is NOT Authenticated ::
      res.status(401).json({message: 'User is not authenticated, Please login to access this Micro App'});

    }

  } else {

    // Request is NOT Called By MicroAppFramework ::
    res.status(400).json({message: 'Request is not Called By MicroAppFramework, Please access this Micro App via MicroAppFramework'});

  }


};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
