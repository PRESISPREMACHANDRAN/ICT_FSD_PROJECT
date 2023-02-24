const Mongoose = require('mongoose');

const commentSchema = new Mongoose.Schema({
  
  content: {
    type: String,
    // required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
});

const TextModel= Mongoose.model('TextModels', commentSchema);
module.exports = {TextModel}
