var mongoose = require('mongoose');
var moment = require('moment');

var Person = require('./person');

var Schema = mongoose.Schema;

var campaignSchema = new Schema({
  category: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  start_date: {
    type: Date
  },
  end_date: {
    type: Date
  },
  aspired_amout: {
    type: Number
  },
  people_reached: {
    type: Number
  },
  priority: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  creators: [{
    type: Schema.Types.ObjectId, ref:'User',
    unique: true
  }],
  collaborators: [{
    type: Schema.Types.ObjectId, ref:'User',
    unique: true
  }],
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
  description: {
    type: String
  },
  history: {
    text: {
      type: String
    },
    banner: {
      type: String
    }
  },
  multimedia: [{
    type: String,
    url: String
  }],
  visits: {
    type: Number
  },
  likes: [{
    type: Schema.Types.ObjectId, ref:'User',
    unique: true
  }],
  dislikes: [{
    type: Schema.Types.ObjectId, ref:'User',
    unique: true
  }],
  shares: [{
    type: Schema.Types.ObjectId, ref:'User'
  }],
  volunteers: [{
    type: Schema.Types.ObjectId, ref:'User'
  }],
  certificates_list: [{
    type: String
  }],
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
    user: {
      type: Schema.Types.ObjectId, ref: 'User'
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
    user: {
      type: Schema.Types.ObjectId, ref: 'User'
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
  comments: [{
    type: Schema.Types.ObjectId, ref: 'Comment'
  }],
  updates: [{
    likes: [{
      type: Schema.Types.ObjectId, ref: 'User'
    }],
    dislikes: [{
      type: Schema.Types.ObjectId, ref: 'User'
    }],
    picture: {
      type: String
    },
    text: {
      type: String
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    comment: [{
      type: Schema.Types.ObjectId, ref: 'Comment'
    }]
  }],
  pictures: [{
    type: Schema.Types.ObjectId, ref: 'Media'
  }],
  validated: {
    type: Schema.Types.ObjectId, ref: 'User'
  }
});


var Campaign = module.exports = mongoose.model('Campaign', campaignSchema);

