
const User = require('../../models/user');
const Person = require('../../models/person');
const Company = require('../../models/company');

const LEVELS_PERSON = [];
LEVELS_PERSON[0] = 'Donador Baby';
LEVELS_PERSON[1] = 'Donador Junior';
LEVELS_PERSON[2] = 'Donador Escudero';
LEVELS_PERSON[3] = 'Donador Caballero';
LEVELS_PERSON[4] = 'Donador Rey';
LEVELS_PERSON[5] = 'Donador Baby';

const LEVELS_COMPANY = [];
LEVELS_COMPANY[0] = 'Donador Baby';
LEVELS_COMPANY[1] = 'Responsabilidad Social Junior';
LEVELS_COMPANY[2] = 'Resposabilidad Social Escudero';
LEVELS_COMPANY[3] = 'Responsabilidad Social Caballero';
LEVELS_COMPANY[4] = 'Responsabilidad social Rey';


const ACHIEVEMENTS = [];
ACHIEVEMENTS['help_others'] = {
  url: 'firstcampaign.png',
  title: 'Yo ayudo a los démas',
  text: 'Por crear tu primera campaña o donar dinero'
};




module.exports.addAchievement = (idUser, action) => {
  /*User.findById(idUser).exec()
    .then((person) => {
      if (person.created_campaigns.length > 0 ) {}
    })
    .catch((err) => {
      return err;
    });*/
  User.findById(idUser).exec()
    .then((user) => {
      let tempAchievement = {};
      switch (action) {
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
        default:
          break;
      }

    })
    .catch((err) => {
      return err;
    });
}



/*module.exports.updateLevelPerson = (idUser) => {
  let personScore = null;
  Person.findById(idUser).exec()
    .then((person) => {
      if (person.score < 6000) {
        person.level = 'Donador Baby';

      } else if (person.score < 12000) {
        person.level = 'Donador Junior';

      } else if (person.score < 20000) {
        person.level = 'Donador Escudero';

      } else if (person.score < 30000) {
        person.level = 'Donador Caballero';

      } else if (person.score > 30000) {
        person.level = 'Donador Rey';
      }

      return person.save();
    })
    .catch((err) => {
      return err;
    });
}

module.exports.updateLevelCompany = (idUser) => {
  let personScore = null;
  Company.findById(idUser).exec()
    .then((company) => {
      if (company.score < 1000) {
        company.level = 'Donador Baby';

      } else if (company.score < 30000) {
        company.level = 'Responsabilidad Social Junior';

      } else if (company.score < 50000) {
        company.level = 'Resposabilidad Social Escudero';

      } else if (company.score < 100000) {
        company.level = 'Responsabilidad Social Caballero';

      } else if (company.score > 100000) {
        company.level = 'Responsabilidad social Rey';
      }

      return company.save();
    })
    .catch((err) => {
      return err;
    });
}*/