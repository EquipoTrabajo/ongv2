const Strategy = require('passport-facebook').Strategy;
const Person = require('../models/person');


const fbStrategy = new Strategy({
    clientID: process.env.FB_CLIENTID,
    clientSecret: process.env.FB_CLIENTSECRET,
    callbackURL: 'http://localhost:3000/login/facebook/return',
    profileFields: ['id','name','cover','picture', 'birthday', 'location','gender', 'education','friends', 'likes{name,category}']
  },
  function(accessToken, refreshToken, profile, callback) {
    Person.findOne({ 'facebookid' : profile.id }).exec()
      .then((data) => {
        let response = profile._json;
        let address= response.location.name.split(',');
        if(data){
          return callback(null, data);
        } else {
          let person = new Person(
            {
              "name": response.first_name + ' ' + response.middle_name + ' ' + response.last_name,
              "profile_picture": response.picture.data.url,
              "cover_picture": response.cover.source,
              "birthday": response.birthday,
              "score": 100,
              "level": 1,
              "address": {
                "city": address[0],
                "state": address[1],
                "country": address[2],
                "coordinates": {
                  "x":0,
                  "y":0
                }
              },
              "username": response.id,
              "facebookid": response.id,
              "slogan": "Donar es mi meta",
              "gender": response.gender,
              "email": response.email,
              "followed_people": response.friends.data,
              "likes_fb": JSON.stringify(response.likes.data)
            }
          );
          person.save()
            .then((data) => {
              return callback(null, data);
            })
            .catch((err) => {
              return callback(err);
            });
        } //end else
      })
      .catch((err) => {
        return callback(err);
      });
  });

module.exports = fbStrategy;