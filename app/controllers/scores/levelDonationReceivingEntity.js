const Dre = require('../../models/donationReceivingEntity');

const LEVELS = [];
LEVELS[0] = 'Ong Baby';
LEVELS[1] = 'Ong Escudero';
LEVELS[2] = 'Ong Guerrero';
LEVELS[3] = 'Ong Caballero';
LEVELS[4] = 'Ong Heroe';

module.exports.updateLevelDre = (idUser) => {
  let socore = null;
  Dre.findById(idUser).exec()
    .then((dre) => {
      if (dre.score < 10000) {
        dre.score = LEVELS[0];
      } else if (dre.score < 30000) {
        dre.score = LEVELS[1];
      } else if (dre.score < 60000) {
        dre.score = LEVELS[2];
      } else if (dre.score < 90000) {
        dre.score = LEVELS[3];
      } else if (dre.score >= 90000) {
        dre.score = LEVELS[4];
      }
      return dre.save();
    })
    .catch((err) => {
      return err;
    });
}