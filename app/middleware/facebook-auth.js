const Strategy = require('passport-facebook').Strategy;
const Person = require('../models/person');


const fbStrategy = new Strategy({
    clientID: process.env.FB_CLIENTID,
    clientSecret: process.env.FB_CLIENTSECRET,
    callbackURL: 'http://localhost:3000/login/facebook/return',
    profileFields: ['id','name','cover','picture', 'birthday', 'location','gender', 'education','friends', 'likes.limit(50){name,created_time,category,category_list,fan_count,location}'],
    profileURL: 'https://graph.facebook.com/v2.8/me'
  },
  function(accessToken, refreshToken, profile, callback) {
    Person.findOne({ 'facebookid' : profile.id }).exec()
      .then((person) => {
        let response = profile._json;
        

        let firstName = response.first_name || '';
        let middleName = response.middle_name || '';
        let lastName = response.last_name || '';
        
        let profilePicture = undefined;
        if (response.picture) {
          profilePicture = response.picture.data.url;
        }
        
        let coverPicture = undefined;
        if (response.cover) {
          coverPicture = response.cover.source;
        }
        
        let birthday = response.birthday || undefined;
        
        let address = [undefined,undefined,undefined];
        if(response.location) {
          address = response.location.name.split(',');
        }

        let friends = undefined;
        if (response.friends) {
          friends = response.friends.data;
        }
        
        if(person){
          //return callback(null, person);
          person.name = firstName + ' ' + middleName + ' ' + lastName;
          person.profile_picture = profilePicture;
          person.cover_picture = coverPicture;
          person.birthday = birthday;
          person.gender = response.gender
          person.address['city'] = address[0];
          person.address['state'] = address[1];
          person.address['country'] = address[2];
          person.facebookid = response.id;
          person.followed_people = friends;
          person.likes_fb = JSON.stringify(response.likes.data, null, ' ');
          person.fb_token = accessToken;
          
          person.save((err, result) => {
            if (err) {
              return callback(err);
            }
            return callback(null, person);
          });
        } else {
          let person = new Person(
            {
              "name": firstName + ' ' + middleName + ' ' + lastName,
              "profile_picture": profilePicture,
              "cover_picture": coverPicture,
              "birthday": birthday,
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
              "followed_people": friends,
              "likes_fb": JSON.stringify(response.likes.data, null, ' ')
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