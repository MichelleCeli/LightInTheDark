const express = require("express");
const bodyParser = require("body-parser");
const InitMongoServer = require("./helpers/db");
const app = express();
const port = 27017;
var path = require("path");
const { response } = require("express");
const mongoose = require("mongoose");
const MONGOURI = "mongodb://localhost:27017/";

//InitMongoServer();
try {
  mongoose.connect(MONGOURI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
  console.log("Connected to DB !!");
} catch (e) {
  console.log(e);
  throw e;
}

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 

var userService = require('./router/userService');
app.use('/', userService);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

