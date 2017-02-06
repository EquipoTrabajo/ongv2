var express = require('express'),
  router = express.Router(),
  ensureAuthenticated = require('../middleware/authenticated'),
  mongoose = require('mongoose'),
  Company = require('../models/company');

module.exports = function (app) {
  app.use('/', router);
};

router.use(ensureAuthenticated);

router.get('/profile', (req, res) => {
  res.render('profile', {user: req.user});
});


router.get('/company', (req, res) => {
  res.render('add-company', {user: req.user});
});

router.get('/campaign', (req, res) => {
  res.render('add-campaign', {user: req.user});
});

router.post('/company', (req, res, next) => {
  Company.create(req.body)
    .then((data) => {
      return res.json(data);
    }).catch((err) => {
      return next(err);
    });
});

router.get('/company/:username', (req, res, next) => {
  console.log('Estoy en priemp');
  Company.findOne({'username': req.params.username})
    .then((data) => {
      if (data) {
        console.log(data);
        return res.render('view-company', {user: req.user, company: data});
      } else {
        return res.end('Nada que mostrar');
      }
    }).catch((err) => {
      console.log(err);
      return next(err);
    });
});

