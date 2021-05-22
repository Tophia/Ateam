const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
 
const UserSchema = new Schema({
first_name: {
    type: String
   },
last_name: {
    type: String
    
   },
profile_Picture: {
    type: String
   },
 email: {
  type: String,
  required: true,
  trim: true
 },
 password: {
  type: String,
  required: true
 },
 userType: {
  type: String,
  default: 'admin',
  enum: ["admin", "manager"]
 },
 accessToken: {
  type: String
 }
});
UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('user', UserSchema);
 
module.exports = User;
// const mongoose = require('mongoose');
// passportLocalMongoose = require("passport-local-mongoose");
// const UserSchema = new mongoose.Schema({
//     first_name: String,
//     last_name: String,
//     profile_Picture: String,
//     email: String,
//     password: String,
//     userType: String,
    
// }, {
//     timestamps: true // Mongoose uses this option to automatically add two new fields — createdAt and updatedAt to the schema.
// });
// UserSchema.plugin(passportLocalMongoose);
// module.exports = mongoose.model('User', UserSchema);

