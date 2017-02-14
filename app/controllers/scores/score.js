const SCORE_DONATE = 2000;
const SCORE_VOLUNTEER = 1000;
const SCORE_COMMENT = 25;
const SCORE_UPLOAD_PICTURE = 50;
const SCORE_RATE = 100;
const SCORE_COMPLETE_PROFILE = 300;
const SCORE_FB = 1000;
const SCORE_CREATE_CAMPAIGN = 2000;

const User = require('../../models/user');

module.exports.updateScore = (idUser, acction) => {
  let acctionValue = null;
  switch (acction) {
    case 'donate':
      acctionValue = SCORE_DONATE;
      break;
    case 'volunteer':
      acctionValue = SCORE_VOLUNTEER;
      break;
    case 'comment':
      acctionValue = SCORE_COMMENT;
      break;
    case 'upload_picture':
      acctionValue = SCORE_UPLOAD_PICTURE;
      break;
    case 'rate':
      acctionValue = SCORE_RATE;
      break;
    case 'complete_profile':
      acctionValue = SCORE_COMPLETE_PROFILE;
      break;
    case 'create_facebook_button':
      acctionValue = SCORE_FB;
      break;
    case 'create_campaign':
      acctionValue = SCORE_CREATE_CAMPAIGN;
      break;
    default:
      acctionValue = 0;
      break;
  }
  return User.findByIdAndUpdate(idUser, {$inc: {'score': acctionValue}}).exec();
}
