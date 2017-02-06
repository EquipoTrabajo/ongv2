var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  ensureAuthenticated = require('../middleware/authenticated'),
  Article = require('../models/article'),
  User = require('../models/user'),
  Person = require('../models/person'),
  Company = require('../models/company');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  res.render('index');
});

router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect("/");
});


router.get('/home', ensureAuthenticated, (req, res, next) => {
  //res.json(req.user);
  res.render('home', {user: req.user});
});

