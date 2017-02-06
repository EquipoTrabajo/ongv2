var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var User = require('./user');

var companySchema = new Schema({
  slogan: {
    type: String
  },
  description: {
    type: String
  },
  admins: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }]
}, {discriminatorKey: 'type'});

var Company = module.exports = User.discriminator('company', companySchema);