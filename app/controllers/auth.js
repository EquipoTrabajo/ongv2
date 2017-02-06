var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport');

module.exports = function (app) {
  app.use('/', router);
};

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

router.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'user_friends', 'email', 'user_birthday', 'user_likes', 'user_location', 'user_photos', 'user_education_history'] }));

router.get('/login/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/home');
    //res.json(req.user)
  });