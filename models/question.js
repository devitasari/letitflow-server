const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  tags: {
    type: Array,
    validate: {
      validator: function(tags) {
        return tags.length >= 1
      },
      msg: 'Tags must be filled min 1'
    }
  },
  upvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  downvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User field is required']
  }
}, { timestamps: true })

const question = mongoose.model('Question', questionSchema)

module.exports = question
