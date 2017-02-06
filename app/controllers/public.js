var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = require('../models/user'),
  Person = require('../models/person'),
  Campaign = require('../models/campaign'),
  Comment = require('../models/comment'),
  Company = require('../models/company');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/campaigns/:idCampaign', (req, res, next) => {
  Campaign.findById(req.params.idCampaign).populate('comments').exec()
    .then((data) => {
      return res.render('view-campaign', {'user': req.user, 'campaign': data});
    })
    .catch((err) => {
      return next(err);
    });
});

