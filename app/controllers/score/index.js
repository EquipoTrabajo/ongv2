module.exports.updateScore = (idUser, action, userType) => {
  if (userType === 'person' || userType === 'company') {
    return require('./userScore').updateScore(idUser, action);
  } else {
    return require('./donationReceivingEntityScore').updateScore(idUser, action);
  }
}