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
		type: Number,
    default: 100
	},
  facebook_btn: {
    type: Boolean,
    default: false
  },
  edited: {
    type: Boolean,
    default: false
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
  gratitudes: [{
      likes: [{
        type: Schema.Types.ObjectId, ref: 'User'
      }],
      dislikes: [{
        type: Schema.Types.ObjectId, ref: 'User'
      }],
      text: {
        type: String
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
      }],
      successful: {
        type: Boolean
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
    },
    created_at: {
      type: Date,
      default: Date.now
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
  }],
  followers: [{
    type: Schema.Types.ObjectId, ref: 'User',
    unique: true
  }]
}, {discriminatorKey: 'type'});

var User = module.exports = mongoose.model('User', userSchema);



