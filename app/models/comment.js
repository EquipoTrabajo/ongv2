var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  likes: [{
    type: Schema.Types.ObjectId, ref: 'User',
    unique: true
  }],
  dislikes: [{
    type: Schema.Types.ObjectId, ref: 'User',
    unique: true
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
  }]
});

var Comment = module.exports = mongoose.model('Comment', commentSchema);
