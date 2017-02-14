
const User = require('../../models/user');
const Person = require('../../models/person');
const Company = require('../../models/company');


module.exports.addAchievement = (idUser, achievement) => {
  let tempAchievement = {};
  switch (achievement) {
    case 'baby_donor':
      tempAchievement = {
        url: '/images/babydonor.png',
        title: 'Baby Donador',
        text: 'Este logro se obtiene cuando tienes más de 100 pts.'
      }
      break;
    case 'first_campaign':
      tempAchievement = {
        url: '/images/firstcampaign.png',
        title: 'Yo ayudo a los démas',
        text: 'Por crear tu primera campaña o donar dinero'
      }
      break;
    default:
      break;
  }
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