var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var User = require('./user');

var donationReceivingEntitySchema = new Schema({
  description: {
    type: String
  },
  campaign_list: [{
    type: Schema.Types.ObjectId, ref:'User'
  }],
  campaign_list_collab: [{
    type: Schema.Types.ObjectId, ref:'User'
  }],
  certificate_list_selfcampaign: [{
    type: String
  }],
  certificate_list_collab_campaign: [{
    type: String
  }],
  donor_list_person: [{
    type: Schema.Types.ObjectId, ref:'User'
  }],
  donor_list_company: [{
    type: Schema.Types.ObjectId, ref:'User'
  }],
  reviews: [{
    type: Schema.Types.ObjectId, ref:'Review'
  }]
}, {discriminatorKey: 'type'});

var DonationReceivingEntity = module.exports = User.discriminator('donationReceivingEntity', donationReceivingEntitySchema);