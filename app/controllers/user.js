var express = require('express'),
  router = express.Router(),
  ensureAuthenticated = require('../middleware/authenticated'),
  mongoose = require('mongoose'),
  Company = require('../models/company'),
  Person = require('../models/person'),
  User = require('../models/user'),
  Comment = require('../models/comment'),
  Media = require('../models/media'),
  Campaign = require('../models/campaign');

var fs = require('fs');
var path = require('path');

module.exports = function (app) {
  app.use('/', router);
};

router.use(ensureAuthenticated);


router.get('/home', (req, res, next) => {
  Campaign.find().exec((err, allCampaigns) => {
    if(err){
      next(err);
    }
    Campaign.getRecommendedCampaigns(req.user._id, (err, recommendedCampaigns) => {
      if (err) {
        next(err);
      }
      console.log(req.user.address.city);
      Campaign.getNearbyCampaigns(req.user.address.city, (err, nearbyCampaigns) => {
        if (err) {
          throw err;
        }
        res.render('home', {user: req.user, allCampaigns: allCampaigns, recommendedCampaigns: recommendedCampaigns, nearbyCampaigns: nearbyCampaigns});
      });
    });
  });
});


router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get('/profile', (req, res) => {
  User.findById(req.user._id).populate(['administrated_companies', 'donations.campaign', 'created_campaigns', 'volunteer_campaigns']).exec()
    .then((person) => {
      return res.render('profile', {user: req.user, 'profile': person});
      //return res.json(person);
    })
    .catch((err) => {
      return next(err);
    });
});


router.get('/company', (req, res) => {
  res.render('add-company', {user: req.user});
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
  Company.findOne({'username': req.params.username})
    .then((data) => {
      if (data) {
        return res.render('view-company', {user: req.user, company: data});
      } else {
        return res.end('Nada que mostrar');
      }
    }).catch((err) => {
      return next(err);
    });
});


/*********CAMPAIGN********/

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


router.put('/campaign/:idCampaign/like', (req, res, next) => {
  //Person.find({'_id': req.user._id, 'liked_campaigns': req.params.idCampaign })
  Campaign.update({'_id': req.params.idCampaign}, {$push: {'likes': req.user._id }})
    .then((crslt) => {
      return Person.update({'_id': req.user._id}, {$push: {'liked_campaigns': req.params.idCampaign}}).exec();
    })
    .then((prslt) => {
      return res.json(prslt);
    })
    .catch((err) => {
      return next(err);
    });
});

router.put('/campaign/:idCampaign/dislike', (req, res, next) => {
  Campaign.update({'_id': req.params.idCampaign}, {$push: {'dislikes': req.user._id }})
    .then((data) => {
      return res.json(data);
    }).catch((err) => {
      return next(err);
    });
});


router.put('/campaign/:idCampaign/share', (req, res, next) => {
  Campaign.update({'_id': req.params.idCampaign}, {$push: {'shares': req.user._id }})
    .then((data) => {
      return res.json(data);
    }).catch((err) => {
      return next(err);
    });
});


router.put('/campaign/:idCampaign/donate', (req, res, next) => {
  Campaign.update({'_id': req.params.idCampaign}, {$push: {'donations': {
    amount: req.body.amount,
    state: req.body.state,
    user: req.user._id
  }}})
    .then((donation) => {
      return User.update({'_id': req.user._id}, {$push: {'donations': {
        amount: req.body.amount,
        state: req.body.state,
        name: req.user.name,
        campaign: req.params.idCampaign
      }}});
    })
    .then((udonation) => {
      return res.json(udonation);
    }).catch((err) => {
      return next(err);
    });
});


router.put('/campaign/:idCampaign/volunteer', (req, res, next) => {
  Campaign.update({'_id': req.params.idCampaign}, {$push: {'volunteers': req.user._id }})
    .then((campaign) => {
      return Person.update({'_id': req.user._id}, {$push: {'volunteer_campaigns': req.params.idCampaign}});
    })
    .then((person) => {
      return res.json(person);
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

router.post('/campaign/:idCampaign/update', function (req, res, next) {
  let fstream;
  let text = '';
  req.pipe(req.busboy);
  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    text = val;
  });
  req.busboy.on('file', function (fieldname, file, filename) {

    //Path where image will be uploaded
    fstream = fs.createWriteStream(path.resolve('./public/uploads/images/') + '/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      let media = {
        'picture': filename,
        'text': text
      }

      Campaign.update({'_id': req.params.idCampaign}, {$push: {'updates': media}}).exec()
        .then((curslt) => {
          return res.redirect('/campaigns/' + req.params.idCampaign);
        })
        .catch((err) => {
          return next(err);
        });
    });
  });
});

//TODO
router.post('/campaign/:idCampaign/media', function (req, res, next) {
  let fstream;
  let description = '';
  req.pipe(req.busboy);
  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    description = val;
  });
  req.busboy.on('file', function (fieldname, file, filename) {

    //Path where image will be uploaded
    fstream = fs.createWriteStream(path.resolve('./public/uploads/images/') + '/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      let media = {
        'url': filename,
        'person_name': req.user.name,
        'person': req.user._id,
        'campaign': req.params.idCampaign,
        'description': description
      };
      Media.create(media)
        .then((media) => {
          return Campaign.update({'_id': req.params.idCampaign}, {$push: {'pictures': media}}).exec();
        })
        .then((ucrslt) => {
          return res.redirect('/campaigns/' + req.params.idCampaign);
        })
        .catch((err) => {
          return next(err);
        });
    });
  });
});

