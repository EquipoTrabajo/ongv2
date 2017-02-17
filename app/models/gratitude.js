var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var gratitudeSchema = new Schema({
	likes: [{
		type: Schema.Types.ObjectId, ref: 'User'
	}],
	dislikes: [{
		type: Schema.Types.ObjectId, ref: 'User'
	}],
	text: {
		type: String
	},
	user: {
		type: Schema.Types.ObjectId, ref: 'User'
	},
	campaign: {
		type: Schema.Types.ObjectId, ref: 'Campaign'
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	comment: [{
		type: Schema.Types.ObjectId, ref: 'Comment'
	}]
});

var Gratitude = module.exports = mongoose.model('Gratitude', gratitudeSchema);

