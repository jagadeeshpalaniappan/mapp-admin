'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MicroApp = mongoose.model('MicroApp'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

//var appcache = require('../../../../config/lib/appcache');

/**
 * Create an microapp
 */
exports.create = function (req, res) {
  var microapp = new MicroApp(req.body);
  microapp.user = req.user;

  microapp.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(microapp);

      // Update Cache ::
      //appcache.updateMicroAppsConfigCache();
    }
  });
};

/**
 * Show the current microapp
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var microapp = req.microapp ? req.microapp.toJSON() : {};

  // Add a custom field to the MicroApp, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the MicroApp model.
  microapp.isCurrentUserOwner = !!(req.user && microapp.user && microapp.user._id.toString() === req.user._id.toString());

  res.json(microapp);
};

/**
 * Update an microapp
 */
exports.update = function (req, res) {
  var microapp = req.microapp;

  microapp.title = req.body.title;
  microapp.content = req.body.content;

  microapp.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(microapp);

      // Update Cache ::
      //appcache.updateMicroAppsConfigCache();
    }
  });
};

/**
 * Delete an microapp
 */
exports.delete = function (req, res) {
  var microapp = req.microapp;

  microapp.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(microapp);

      // Update Cache ::
      //appcache.updateMicroAppsConfigCache();
    }
  });
};

/**
 * List of MicroApps
 */
exports.list = function (req, res) {
  MicroApp.find().sort('-created').populate('user', 'displayName').exec(function (err, microapps) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(microapps);
    }
  });
};

/**
 * MicroApp middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'MicroApp is invalid'
    });
  }

  MicroApp.findById(id).populate('user', 'displayName').exec(function (err, microapp) {
    if (err) {
      return next(err);
    } else if (!microapp) {
      return res.status(404).send({
        message: 'No microapp with that identifier has been found'
      });
    }
    req.microapp = microapp;
    next();
  });
};
