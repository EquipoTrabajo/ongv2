var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var User = require('./user');

var adminSchema = new Schema({

}, {discriminatorKey: 'type'});

var Admin = module.exports = User.discriminator('admin', adminSchema);