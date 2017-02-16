const Company = require('../../models/company');


const LEVELS_COMPANY = [];
LEVELS_COMPANY[0] = 'Donador Baby';
LEVELS_COMPANY[1] = 'Responsabilidad Social Junior';
LEVELS_COMPANY[2] = 'Resposabilidad Social Escudero';
LEVELS_COMPANY[3] = 'Responsabilidad Social Caballero';
LEVELS_COMPANY[4] = 'Responsabilidad social Rey';

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