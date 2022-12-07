const mongoose = require('mongoose')
// https://mongoosejs.com/docs/schematypes.html
// Import unique validator from package installed called mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator")


const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true}

});


// You can add plugins to schemas
userSchema.plugin(uniqueValidator);


// Make model available outside of this file
module.exports = mongoose.model('User', userSchema);
