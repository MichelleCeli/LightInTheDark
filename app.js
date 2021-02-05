const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 27017;
const mongoose = require("mongoose");
const MONGOURI = "mongodb://localhost:27017/";
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

try {
  mongoose.connect(MONGOURI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
  console.log("Connected to DB !!");
} catch (e) {
  console.log(e);
  throw e;
}

var store = new MongoDBStore({
  uri: MONGOURI,
  collection: 'sessions'
})

store.on('error', function(error) {
  console.log(error);
});

app.use(session({secret: "secret", store: store, resave: false, saveUninitialized: false}));
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 

var userService = require('./router/userService');
app.use('/', userService);

var score = require('./router/score');
app.use('/', score);

var gameService = require('./router/gameService');
app.use('/', gameService);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

