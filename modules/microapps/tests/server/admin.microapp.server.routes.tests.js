'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  MicroApp = mongoose.model('MicroApp'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  microapp;

/**
 * MicroApp routes tests
 */
describe('MicroApp Admin CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new microapp
    user.save(function () {
      microapp = {
        title: 'MicroApp Title',
        content: 'MicroApp Content'
      };

      done();
    });
  });

  it('should be able to save an microapp if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new microapp
        agent.post('/api/microapps')
          .send(microapp)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle microapp save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Get a list of microapps
            agent.get('/api/microapps')
              .end(function (articlesGetErr, articlesGetRes) {
                // Handle microapp save error
                if (articlesGetErr) {
                  return done(articlesGetErr);
                }

                // Get microapps list
                var microapps = articlesGetRes.body;

                // Set assertions
                (microapps[0].user._id).should.equal(userId);
                (microapps[0].title).should.match('MicroApp Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an microapp if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new microapp
        agent.post('/api/microapps')
          .send(microapp)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle microapp save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Update microapp title
            microapp.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing microapp
            agent.put('/api/microapps/' + articleSaveRes.body._id)
              .send(microapp)
              .expect(200)
              .end(function (articleUpdateErr, articleUpdateRes) {
                // Handle microapp update error
                if (articleUpdateErr) {
                  return done(articleUpdateErr);
                }

                // Set assertions
                (articleUpdateRes.body._id).should.equal(articleSaveRes.body._id);
                (articleUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an microapp if no title is provided', function (done) {
    // Invalidate title field
    microapp.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new microapp
        agent.post('/api/microapps')
          .send(microapp)
          .expect(422)
          .end(function (articleSaveErr, articleSaveRes) {
            // Set message assertion
            (articleSaveRes.body.message).should.match('Title cannot be blank');

            // Handle microapp save error
            done(articleSaveErr);
          });
      });
  });

  it('should be able to delete an microapp if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new microapp
        agent.post('/api/microapps')
          .send(microapp)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle microapp save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Delete an existing microapp
            agent.delete('/api/microapps/' + articleSaveRes.body._id)
              .send(microapp)
              .expect(200)
              .end(function (articleDeleteErr, articleDeleteRes) {
                // Handle microapp error error
                if (articleDeleteErr) {
                  return done(articleDeleteErr);
                }

                // Set assertions
                (articleDeleteRes.body._id).should.equal(articleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single microapp if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new microapp model instance
    microapp.user = user;
    var articleObj = new MicroApp(microapp);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new microapp
        agent.post('/api/microapps')
          .send(microapp)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle microapp save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Get the microapp
            agent.get('/api/microapps/' + articleSaveRes.body._id)
              .expect(200)
              .end(function (articleInfoErr, articleInfoRes) {
                // Handle microapp error
                if (articleInfoErr) {
                  return done(articleInfoErr);
                }

                // Set assertions
                (articleInfoRes.body._id).should.equal(articleSaveRes.body._id);
                (articleInfoRes.body.title).should.equal(microapp.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (articleInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      MicroApp.remove().exec(done);
    });
  });
});
