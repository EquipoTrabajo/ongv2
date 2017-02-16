const SCORE_CREATE_CAMPAIGN = 200;

const LevelDre = require('./levelDonationReceivingEntity');

const User = require('../../models/user');

module.exports.updateScore = (idUser, action) => {
  let acctionValue = null;
  switch (action) {
    case 'create_campaign':
      acctionValue = SCORE_CREATE_CAMPAIGN;
      break;
    default:
      acctionValue = 0;
      break;
  }
  LevelDre.updateLevelDre(idUser)
    .then((rslt) => {
      return User.findByIdAndUpdate(idUser, {$inc: {'score': acctionValue}}).exec();
    })
    .catch((err) => {
      return err;
    });
}
