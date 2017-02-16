const Person = require('../../models/person');
const Company = require('../../models/company');


module.exports.updateLevelPerson = (idUser) => {
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