var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  ensureAuthenticated = require('../middleware/authenticated'),
  Article = require('../models/article');
  User = require('../models/user');
  Person = require('../models/person');
  Company = require('../models/company');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });
});

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  res.render('index');
});

router.get('/home', ensureAuthenticated, (req, res, next) => {
  //res.json(req.user);
  res.render('home', {user: req.user});
});

router.post('/new-article', (req, res) => {
  Article.create(req.body)
    .then((article) => {
      return res.json(article);
    });
});

router.post('/add-person', (req, res) => {
  Person.create(req.body)
    .then((data) => {
      return res.json(data);
    });
});

router.post('/add-company', (req, res, next) => {
  Company.create(req.body)
    .then((data) => {
      return res.json(data);
    }).catch((err) => {
      return next(err);
    });
});