const express = require('express');
const { createDeflateRaw } = require('zlib');
const app = express();
const port = 27017;
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/", {useNewParser: true},
  function(err, db) {
if (err) throw err;
console.log("Database connected!");
db.close();
});
//const mongoose = require('mongoose');
//mongoose.connect(`mongodb://localhost:27017`, {useNewUrlParser: true});

/* const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
}); */


app.use(express.static('public'));

/* app.get('/', function(req, res) {
  res.sendFile('public' + '/' + 'Startmenu.html');
}) */

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})