const Strategy = require('passport-local').Strategy;
const User = require('../models/user');
const Dre = require('../models/donationReceivingEntity');

const localStrategy = new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function (req, username, password, callback) {
  console.log('Estoy en local strategy');
  Dre.findOne({'username': username}).exec()
    .then((user) => {
      console.log(JSON.stringify(user, null, ' '));
      if (user) {
        return callback(null, user);
      } else {
        return callback(null, false);
      }
    })
    .catch((err) => {
      console.log('there was an error..');
      return callback(err);
    });

});

module.exports = localStrategy;