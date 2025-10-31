const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String
  },
  author: {
    type: String,
    required: true,
    default: '峰叔'
  },
  date: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);