const mongoose = require('mongoose')
// https://mongoosejs.com/docs/schematypes.html


const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});

// Make model available outside of this file
module.exports = mongoose.model('Post', postSchema);
