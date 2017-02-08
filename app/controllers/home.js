var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  ensureAuthenticated = require('../middleware/authenticated'),
  Campaign = require('../models/campaign'),
  User = require('../models/user'),
  Person = require('../models/person'),
  Company = require('../models/company');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', (req, res, next) => {
  if(req.user) {
    res.redirect("/home");
  } else {
    res.render('index');
  }
});

router.get('/login', (req, res, next) => {
  res.render('index');
});






