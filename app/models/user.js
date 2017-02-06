var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
		type: String,
		required: true
	},
	profile_picture: {
		type: String
	},
	cover_picture: {
		type: String
	},
	address: {
		city: {
			type: String
		},
		state: {
			type: String
		},
		country: {
			type: String
		},
		coordinates: {
			x: {
				type: Number
			},
			y: {
				type: Number
			}
		}
	},
	score: {
		type: Number
	},
	level: {
		type: Number
	}
}, {discriminatorKey: 'type'});

var User = module.exports = mongoose.model('User', userSchema);



