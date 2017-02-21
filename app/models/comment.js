var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

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
  user_name: {
    type: String
  },
  user_picture: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  comment: [{
    type: Schema.Types.ObjectId, ref: 'Comment'
  }]
});

commentSchema
  .virtual('userName')
  .get(() => {
    User.findById(this.user).exec()
      .then((user) => {
        return user.name;
      })
      .catch((err) => {
        return err;
      });
  });

var Comment = module.exports = mongoose.model('Comment', commentSchema);
