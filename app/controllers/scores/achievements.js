
const User = require('../../models/user');
const Person = require('../../models/person');
const Company = require('../../models/company');

const ACHIEVEMENTS = [];

ACHIEVEMENTS['baby_donor'] = {
  url: 'babydonor.png',
  title: 'Baby Donador',
  text: 'Por registrarte y ganar 100 pts.'
};


ACHIEVEMENTS['help_others'] = {
  url: 'helpothers.png',
  title: 'Yo ayudo a los démas',
  text: 'Por crear tu primera campaña o donar dinero'
};

ACHIEVEMENTS['photograph'] = {
  url: 'photograph.png',
  title: 'Fotografo',
  text: 'Por subir fotos'
};

ACHIEVEMENTS['expert_category'] = (category) => {return {
  url: 'expert_category.png',
  title: 'Experto en ' + category,
  text: 'Por donar más de dos veces en una categoría'
}};

ACHIEVEMENTS['global_donor'] = {
  url: 'global_donor.png',
  title: 'Donador Global',
  text: 'Por donar en más de 3 paises diferentes..'
};

ACHIEVEMENTS['critic'] = {
  url: 'critic.png',
  title: 'Critico',
  text: 'Por hacer valoraciones..'
};



module.exports.addAchievement = (idUser, action) => {
  User.findById(idUser).populate('donations.campaign').exec()
    .then((user) => {
      let tempAchievement = {};
      switch (action) {
        case 'register':
          return User.findByIdAndUpdate(idUser, {$push: {'achievements': ACHIEVEMENTS['baby_donor']}}).exec();
          break;
        case 'create_campaign':
          if (user.created_campaigns.length === 1) {
            //user.achievements.push(ACHIEVEMENTS['help_others']);
            return User.findByIdAndUpdate(idUser, {$push: {'achievements': ACHIEVEMENTS['help_others']}}).exec();
          } else {
            return User.update({'achievements.title': ACHIEVEMENTS['help_others'].title}, {$inc: {'achievements.$.level': 1}}).exec();
          }
          break;
        case 'volunteer':
          if (user.volunteer_campaigns.length % 2 === 0) {
            return User.update({'achievements.title': ACHIEVEMENTS['help_others'].title}, {$inc: {'achievements.$.level': 1}}).exec();
          } else {
            return null;
          }
          break;
        case 'donate':
          if (user.donations.length % 2 === 0) {
            return User.update({'achievements.title': ACHIEVEMENTS['help_others'].title}, {$inc: {'achievements.$.level': 1}}).exec();
          } else {
            return null;
          }
          break;
        case 'media':
          if (user.pictures_upload.length === 3) {
            return User.findByIdAndUpdate(idUser, {$push: {'achievements': ACHIEVEMENTS['photograph']}}).exec();
          } else if (user.pictures_upload.length % 3 === 0) {
            return User.update({'achievements.title': ACHIEVEMENTS['photograph'].title}, {$inc: {'achievements.$.level': 1}}).exec();
          } else {
            return null;
          }
          break;
        case 'donate_category':
          if (user.donations[0].campaign) {
            const count = donations => 
              donations.reduce((a, b) => 
                Object.assign(a, {[b.campaign.category]: (a[b.campaign.category] || 0) + 1}), {})

            const duplicates = dict => 
              Object.keys(dict).filter((a) => {
                if(dict[a] > 2) {
                  if(dict[a] === 3) {
                    return User.findByIdAndUpdate(idUser, {$push: {'achievements': ACHIEVEMENTS['expert_category'](a)}}).exec();
                  } else if (dict[a]%2 === 0) {
                    return User.update({'achievements.title': ACHIEVEMENTS['expert_category'](a).title}, {$inc: {'achievements.$.level': 1}}).exec();
                  } else {
                    return null;
                  }
                }
              });
            //delete TODO
            console.log(count(user.donations));
            duplicates(count(user.donations));
          }
          break;
        case 'global_donor':
          let countries = donations.map(donation => {
              return donation.campaign.address.country;
          });

          let filterCountries = countries.filter((x, i, a) => a.indexOf(x) == i);

          if(filterCountries.length > 2) {
            if (filterCountries.length === 3) {
              return User.findByIdAndUpdate(idUser, {$push: {'achievements': ACHIEVEMENTS['global_donor']}}).exec();
            } else if(filterCountries.length%3 === 0){
              return User.update({'achievements.title': ACHIEVEMENTS['global_donor'].title}, {$inc: {'achievements.$.level': 1}}).exec();
            }
          }
          break;
        case 'review':
          if (user.reviews.length > 0) {
            if (user.reviews.length === 0) {
              return User.findByIdAndUpdate(idUser, {$push: {'achievements': ACHIEVEMENTS['critic']}}).exec();
            } else if (user.reviews.length%3 === 0) {
              return User.update({'achievements.title': ACHIEVEMENTS['critic'].title}, {$inc: {'achievements.$.level': 1}}).exec();
            } else {
              return null;
            }
          } else {
            return null;
          }
          break;
        default:
          break;
      }

    })
    .catch((err) => {
      return err;
    });
}
