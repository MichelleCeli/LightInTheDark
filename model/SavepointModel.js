const mongoose = require("mongoose");

const SavepointSchema = mongoose.Schema({
    userID: String,
    title: String,
    level: Number,
    score: Number,
    position: [Number],
    lifepoints: Number,
    lightpoints: Number
},{
  timestamps: true
},
{collection: 'savepoints'}
);

module.exports = mongoose.model("savepoint", SavepointSchema);