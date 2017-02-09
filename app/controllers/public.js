var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = require('../models/user'),
  Person = require('../models/person'),
  Campaign = require('../models/campaign'),
  Media = require('../models/media'),
  Comment = require('../models/comment'),
  Company = require('../models/company');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/campaigns/:idCampaign', (req, res, next) => {
  let campaignPromise = new Promise((resolve, reject) => {
    Campaign.findById(req.params.idCampaign).populate(['comments', 'donations.user', 'updates.comment']).exec((err, campaigns) => {
      console.log(JSON.stringify(campaigns, null, ' '));
      if (err) {
        reject(err);
      }
      resolve(campaigns);
    });
  });

  let mediaPromise = new Promise((resolve, reject) => {
    Media.find({'campaign': req.params.idCampaign}).exec((err, medias) => {
      if (err) {
        reject(err);
      }
      resolve(medias);
    })
  });

  Promise.all([campaignPromise, mediaPromise])
    .then((values) => {
      res.render('view-campaign', {'user': req.user, 'campaign': values[0], 'media': values[1]});
    })
    .catch((err) => {
      return next(err);
    });
});

