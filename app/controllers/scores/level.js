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

module.exports.updateLevelPerson = (idUser) => {
  let personScore = null;
  Person.findById(idUser).exec()
    .then((person) => {
      if (person.score < 6000) {
        person.level = LEVELS_PERSON[0];

      } else if (person.score < 12000) {
        person.level = LEVELS_PERSON[1];

      } else if (person.score < 20000) {
        person.level = LEVELS_PERSON[2];

      } else if (person.score < 30000) {
        person.level = LEVELS_PERSON[3];

      } else if (person.score > 30000) {
        person.level = LEVELS_PERSON[4];
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
        company.level = LEVELS_COMPANY[0];

      } else if (company.score < 30000) {
        company.level = LEVELS_COMPANY[1];

      } else if (company.score < 50000) {
        company.level = LEVELS_COMPANY[2];

      } else if (company.score < 100000) {
        company.level = LEVELS_COMPANY[3];

      } else if (company.score > 100000) {
        company.level = LEVELS_COMPANY[4];
      }

      return company.save();
    })
    .catch((err) => {
      return err;
    });
}