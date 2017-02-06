var mongoose = require('mongoose');

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
  creators: [{
    type: Schema.Types.ObjectId, ref:'User'
  }],
  collaborators: [{
    type: Schema.Types.ObjectId, ref:'User'
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
    type: Schema.Types.ObjectId, ref:'User'
  }],
  dislikes: [{
    type: Schema.Types.ObjectId, ref:'User'
  }],
  shares: [{
    type: Schema.Types.ObjectId, ref:'User'
  }],
  donors: [{
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
    user: {
      type: Schema.Types.ObjectId, ref: 'User'
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    type: Schema.Types.ObjectId, ref: 'Comment'
  }],
  updates: [{
    likes: [{
      type: Schema.Types.ObjectId, ref: 'Person'
    }],
    dislikes: [{
      type: Schema.Types.ObjectId, ref: 'Person'
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