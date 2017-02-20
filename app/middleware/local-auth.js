const Strategy = require('passport-local').Strategy;
const User = require('../models/user');

const localStrategy = new Strategy((username, password, callback) => {
  console.log('Estoy en local strategy');
  User.findOne({'username': username}).exec()
    .then((user) => {
      console.log(JSON.stringify(user, null, ' '));
      if (user) {
        return callback(null, user);
      }else {
        return callback(null, false);
      }
    })
    .catch((err) => {
      console.log('there was an error..');
      return callback(err);
    });

});

module.exports = localStrategy;