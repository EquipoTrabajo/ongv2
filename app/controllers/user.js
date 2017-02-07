var express = require('express'),
  router = express.Router(),
  ensureAuthenticated = require('../middleware/authenticated'),
  mongoose = require('mongoose'),
  Company = require('../models/company'),
  Person = require('../models/person'),
  User = require('../models/user'),
  Comment = require('../models/comment'),
  Campaign = require('../models/campaign');

module.exports = function (app) {
  app.use('/', router);
};

router.use(ensureAuthenticated);

router.get('/profile', (req, res) => {
  User.findById(req.user._id).populate(['administrated_companies', 'donations', 'created_campaigns']).exec()
    .then((person) => {
      return res.render('profile', {user: req.user, 'profile': person});
    })
    .catch((err) => {
      return next(err);
    });
});


router.get('/company', (req, res) => {
  res.render('add-company', {user: req.user});
});

router.get('/campaign', (req, res) => {
  res.render('add-campaign', {user: req.user});
});

router.post('/campaign', (req, res, next) => {
  req.body.creators = [];
  req.body.creators.push(req.user._id);
  Campaign.create(req.body)
    .then((campaign) => {
      return User.update({'_id': req.user._id}, {$push: {'created_campaigns': campaign._id}});
    })
    .then((update) => {
      return res.json(update);
    })
    .catch((err) => {
      return next(err);
    });
});




router.post('/company', (req, res, next) => {
  req.body.admins = [];
  req.body.admins.push(req.user._id);
  Company.create(req.body)
    .then((company) => {
      return Person.update({'_id': req.user._id}, {$push: {'administrated_companies': company._id}});
    })
    .then((update) => {
      return res.json(update);
    })
    .catch((err) => {
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

router.put('/campaign/:idCampaign/like', (req, res, next) => {
  Campaign.update({'_id': req.params.idCampaign}, {$push: {'likes': req.params.idUser }})
    .then((data) => {
      return res.json(data);
    }).catch((err) => {
      //return next(err);
      return res.json(err);
    });
});

router.put('/campaign/:idCampaign/dislike', (req, res, next) => {
  Campaign.update({'_id': req.params.idCampaign}, {$push: {'dislikes': req.params.idUser }})
    .then((data) => {
      return res.json(data);
    }).catch((err) => {
      return next(err);
    });
});


router.put('/campaign/:idCampaign/share', (req, res, next) => {
  Campaign.update({'_id': req.params.idCampaign}, {$push: {'shares': req.params.idUser }})
    .then((data) => {
      return res.json(data);
    }).catch((err) => {
      return next(err);
    });
});


router.post('/campaign/:idCampaign/comment', (req, res, next) => {
  Comment.create({'text': req.body.text, 'user': req.user._id})
    .then((comment) => {
      return Campaign.update({'_id': req.params.idCampaign}, {$push: {'comments': comment._id}});
        
    })
    .then((update) => {
      return res.json(update);
    })
    .catch((err) => {
      return next(err);
    });
});
