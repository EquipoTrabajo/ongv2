var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var User = require('./user');

var personSchema = new Schema({
  facebookid: {
    type: String
  },
  age: {
    type: Number
  },
  slogan: {
    type: String
  },
  birthday: {
    type: Date
  },
  gender: {
    type: String
  },
  email: {
    type: String
  },
  fb_token: {
    type: String
  },
  likes_fb: {
    type: String
  },
  friend_list: [{
    type: Schema.Types.ObjectId, ref: 'User',
    unique: true
  }],
  followed_people: [{
    type: Schema.Types.ObjectId, ref: 'User',
    unique: true
  }],
  followed_companies: [{
    type: Schema.Types.ObjectId, ref: 'User',
    unique: true
  }],
  administrated_companies: [{
    type: Schema.Types.ObjectId, ref: 'User',
    unique: true
  }],
  followed_receivingEntities: [{
    type: Schema.Types.ObjectId, ref: 'User',
    unique: true
  }],
  volunteer_campaigns: [{
    type: Schema.Types.ObjectId, ref: 'Campaign'
  }],
  liked_campaigns: [{
    type: Schema.Types.ObjectId, ref: 'Campaign',
    unique: true
  }],
  seen_campaigns: [{
    type: Schema.Types.ObjectId, ref: 'Campaign',
    unique: true
  }],
  friends_donated_campaigns: [{
    type: Schema.Types.ObjectId, ref: 'Campaign'
  }],
  donation_certificate: [{
    type: String
  }]
}, {discriminatorKey: 'type'});

var Person = module.exports = User.discriminator('person', personSchema);