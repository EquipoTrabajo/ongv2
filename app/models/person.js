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
  gender: {
    type: String
  },
  email: {
    type: String
  },
  friend_list: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }],
  followed_people: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }],
  followed_companies: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }],
  administrated_companies: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }],
  followed_receivingEntities: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }],
  donated_campaigns: [{
    type: Schema.Types.ObjectId, ref: 'Campaign'
  }],
  volunteer_campaigns: [{
    type: Schema.Types.ObjectId, ref: 'Campaign'
  }],
  liked_campaigns: [{
    type: Schema.Types.ObjectId, ref: 'Campaign'
  }],
  seen_campaigns: [{
    type: Schema.Types.ObjectId, ref: 'Campaign'
  }],
  friends_donated_campaigns: [{
    type: Schema.Types.ObjectId, ref: 'Campaign'
  }],
  donation_certificate: [{
    type: String
  }]
}, {discriminatorKey: 'type'});

var Person = module.exports = User.discriminator('person', personSchema);