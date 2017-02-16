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
		type: String,
		default: 'user.png'
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
	donations: [{
    amount: {
      type: Number
    },
    state: {
      type: String
    },
    name: {
      type: String
    },
    campaign: {
      type: Schema.Types.ObjectId, ref: 'Campaign'
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  created_campaigns: [{
    type: Schema.Types.ObjectId, ref: 'Campaign'
  }],
  achievements: [{
    url: {
      type: String
    },
    title: {
      type: String
    },
    level: {
      type: Number,
      default: 1
    },
    text: {
      type: String
    }
  }],
  level: {
		type: String
	},
  reviews: [{
    points: {
      type: Number,
      min: 1,
      max: 5
    },
    text: {
      type: String
    },
    user: {
      type: Schema.Types.ObjectId, ref: 'User'
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    comment: [{
      type: Schema.Types.ObjectId, ref: 'Comment'
    }]
  }]
}, {discriminatorKey: 'type'});

var User = module.exports = mongoose.model('User', userSchema);



