var express = require('express'),
  router = express.Router(),
  ensureAuthenticated = require('../middleware/authenticated'),
  mongoose = require('mongoose'),
  Company = require('../models/company'),
  Person = require('../models/person'),
  Dre = require('../models/donationReceivingEntity'),
  User = require('../models/user'),
  Comment = require('../models/comment'),
  Media = require('../models/media'),
  Campaign = require('../models/campaign');

const ScoreUpdate = require('../controllers/scores/score');
const AchievementsCtrl = require('../controllers/scores/achievements');

var fs = require('fs');
var path = require('path');

module.exports = function (app) {
  app.use('/', router);
};

router.use(ensureAuthenticated);


router.get('/home', (req, res, next) => {
  
  let personPromise = new Promise((resolve, reject) => {
    Person.findById(req.user._id).exec((err, person) => {
      if (err) {
        reject(err);
      } else {
        resolve(person)
      }
    });
  });

  let idCampaignsPromise = new Promise((resolve, reject) => {
    personPromise
      .then((person) => {
        return Campaign.find({'_id': {$in: person.liked_campaigns}}, (err, campaigns) => {
          if (err) {
            reject(err);
          } else {
            let creators = [];
            let tempCampId = [];
            for(let camp in campaigns) {
              tempCampId.push(campaigns[camp]._id);
              for(let i=0; i<campaigns[camp].creators.length; i++) {
                creators.push(campaigns[camp].creators[i]);
              }
            }
            resolve({'idCampaigns': tempCampId, 'creators': creators});
          }
        });
      })
      .catch((err) => {
        reject(err);
      });
  });

  let recommendedCampaignsPromise = new Promise((resolve, reject) => {
    idCampaignsPromise
      .then((idCampaigns) => {
        Campaign.find({'creators': {$in: idCampaigns.creators}, '_id': {$nin: idCampaigns.tempCampId}, 'priority': {$gt: 0}}).exec((err, recommendedCampaigns) => {
          if (err) {
            reject(err);
          } else {
            resolve(recommendedCampaigns);
          }
        });
      })
      .catch((err) => {
        reject(err);
      });
  });

  let allCampaignsPromise = new Promise((resolve, reject) => {
    Campaign.find().exec((err, allCampaigns) => {
      if(err){
        reject(err);
      } else {
        resolve(allCampaigns);
      }
    });
  });

  let nearbyCampaignsPromise = new Promise((resolve, reject) => {
    Campaign.find({'address.city': req.user.address.city}).exec((err, nearbyCampaigns) => {
      if (err) {
        reject(err);
      } else {
        resolve(nearbyCampaigns);
      }
    });
  });

  Promise.all([allCampaignsPromise, nearbyCampaignsPromise, recommendedCampaignsPromise])
    .then((values) => {
      res.render('home', {'user': req.user, 'allCampaigns': values[0], 'recommendedCampaigns': values[2], 'nearbyCampaigns': values[1]});
    })
    .catch((err) => {
      return next(err);
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

router.get('/profile/:idProfile/edit', (req, res, next) => {
  Person.findById(req.params.idProfile).exec()
    .then((person) => {
      return res.render('edit-profile', {'user': req.user, 'person': person});
    })
    .catch((err) => {
      return next(err);
    });
});

router.put('/profile/:idProfile', (req, res, next) => {
  Person.findOneAndUpdate({'_id': req.params.idProfile}, req.body, {upsert: true}).exec()
    .then((update) => {
      return res.json(update);
    })
    .catch((err) => {
      return next(err);
    });
});

router.post('/search/person', (req, res, next) => {
  console.log(req.body.name);
  Person.find({'name': {$regex: req.body.name}}).exec()
    .then((persons) => {
      return res.json(persons);
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


router.get('/company/:idCompany/edit', (req, res, next) => {
  Company.findById(req.params.idCompany).exec()
    .then((company) => {
      return res.render('edit-company', {'user': req.user, 'company': company});
    })
    .catch((err) => {
      return next(err);
    });
});

router.put('/company/:idCompany', (req, res, next) => {
  Company.update({'_id': req.params.idCompany}, req.body, {upsert: true}).exec()
    .then((update) => {
      return res.json(update);
    })
    .catch((err) => {
      return next(err);
    });
});

router.put('/user/:idUser/profile-picture', (req, res, next) => {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    fstream = fs.createWriteStream(path.resolve('./public/uploads/images/') + '/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {   
      User.findByIdAndUpdate(req.params.idUser, {'profile_picture': filename}).exec()
      .then((update) => {
        return res.json(update);
      })
      .catch((err) => {
        return next(err);
      });
    });
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

//Make Admin
router.post('/company/:idCompany/person/:idPerson/add-admin', function (req, res, next) {

  Company.update({'_id': req.params.idCompany}, {$push: {'admins': req.params.idPerson}}).exec()
    .then((company) => {
      return Person.update({'_id': req.params.idPerson}, {$push: {'administrated_companies': req.params.idCompany}}).exec();
    })
    .then((prslt) => {
      return res.json(prslt);
    })
    .catch((err) => {
      return next(err);
    });
});



router.get('/profile/media', (req, res) => {
  let mediaPromise = new Promise((resolve, reject) => {
    Media.find({'person': req.user._id}).exec((err, medias) => {
      if (err) {
        reject(err);
      }
      resolve(medias);
    })
  });
  mediaPromise
    .then((medias) => {
      return res.render('view-media', {user: req.user, 'media': medias});
    })
    .catch((err) => {
      return next(err);
    });
});


router.get('/donation-receiving-entity', (req, res, next) => {
  res.render('add-donationRecivingEntity', {'user': req.user});
});

router.post('/donation-receiving-entity', (req, res, next) => {
  Dre.create(req.body)
    .then((dre) => {
      return res.json(dre);
    })
    .catch((err) => {
      return next(err);
    });
});

router.post('/review/:idUser', (req, res, next) => {
  req.body.user = req.user._id;
  User.findByIdAndUpdate(req.params.idUser, {$push: {'reviews': req.body}}).exec()
    .then((review) => {
      req.body.user = req.params.idUser;
      return User.findByIdAndUpdate(req.user._id, {$push: {'reviews': req.body}}).exec()
    })
    .then((review) => {
      return res.json(review);
    })
    .catch((err) => {
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
      return ScoreUpdate.updateScore(req.user._id, 'create_campaign');
    })
    .then((update) => {
      return AchievementsCtrl.addAchievement(req.user._id, 'create_campaign');
    })
    .then((surslt) => {
      console.log(surslt, null, ' ');
      return res.json('Surslt: ' + surslt);
    })
    .catch((err) => {
      console.log('Erro: ' + err, null, ' ');
      return next(err);
    });
});


router.get('/campaign/:idCampaign/edit', (req, res, next) => {
  Campaign.findById(req.params.idCampaign).exec()
    .then((campaign) => {
      return res.render('edit-campaign', {'user': req.user, 'campaign': campaign});
    })
    .catch((err) => {
      return next(err);
    });
});

router.put('/campaign/:idCampaign', (req, res, next) => {
  Campaign.update({'_id': req.params.idCampaign}, req.body, {upsert: true}).exec()
    .then((campaign) => {
      return res.json(campaign);
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
    .then((update) => {
      return AchievementsCtrl.addAchievement(req.user._id, 'donate');
    })
    .then((update) => {
      return AchievementsCtrl.addAchievement(req.user._id, 'donate_category');
    })
    .then((udonation) => {
      return ScoreUpdate.updateScore(req.user._id, 'donate');
    })
    .then((score) => {
      return res.json(score);
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
      return ScoreUpdate.updateScore(req.user._id, 'volunteer');
    })
    .then((update) => {
      return AchievementsCtrl.addAchievement(req.user._id, 'volunteer');
    })
    .then((score) => {
      return res.json(score);
    }).catch((err) => {
      return next(err);
    });
});



router.post('/campaign/:idCampaign/comment', (req, res, next) => {
  Comment.create({'text': req.body.text, 'user': req.user._id})
    .then((comment) => {
      return Promise.all([Campaign.update({'_id': req.params.idCampaign}, {$push: {'comments': comment._id}}).exec(),
                            ScoreUpdate.updateScore(req.user._id, 'comment')])
      .then((values) => {
        return res.json(values);
      })
      .catch((err) => {
        return next(err);
      });
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


router.post('/update/:idUpdate/comment', function (req, res, next) {
  Comment.create({'text': req.body.text, 'user': req.user._id})
    .then((comment) => {
      return Campaign.update({'updates._id': req.params.idUpdate}, {$push: {'updates.$.comment': comment._id}});
    })
    .then((update) => {
      return res.json(update);
    })
    .catch((err) => {
      return next(err);
    });
});

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
          return [Campaign.update({'_id': req.params.idCampaign}, {$push: {'pictures': media._id}}).exec(), 
                  Person.update({'_id': req.user._id}, {$push: {'pictures_upload': media._id}}).exec()];
        })
        .then((ucrslt, uprslt) => {
          return ScoreUpdate.updateScore(req.user._id, 'upload_picture');
        })
        .then((ucrslt) => {
          return AchievementsCtrl.addAchievement(req.user._id, 'media');;
        })
        .then((usrslt) => {
          return res.redirect('/campaigns/' + req.params.idCampaign);
        })
        .catch((err) => {
          return next(err);
        });
    });
  });
});


router.get('/:username', (req, res, next) => {
  User.findOne({'username': req.params.username}).populate(['administrated_companies', 'donations.campaign', 'created_campaigns', 'volunteer_campaigns']).exec()
    .then((user) => {
      if (user.type === 'person') {
        return res.render('view-person', {'user': req.user, 'person': user});
      } else if(user.type === 'donationReceivingEntity') {
        return res.render('view-donationReceivingEntity', {'user': req.user, 'dre': user});
        //return res.json('fuck you');
      } else {
        return res.json('fuck you');
      }
      //return res.json(person);
    })
    .catch((err) => {
      return next(err);
    });
});