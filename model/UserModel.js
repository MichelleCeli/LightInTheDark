const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/] //Regex, validator?
  },
  password: {
    type: String,
    required: true,
    minLength: 5
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  admin: Boolean
},
{collection: 'users'}
);


// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);