const mongoose = require("mongoose");

const MONGOURI = "mongodb://localhost:27017/";

const InitMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {useNewUrlParser: true, useCreateIndex: true});
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitMongoServer();

module.exports = {
  User: require('../model/UserModel')
};