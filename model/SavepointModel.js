const mongoose = require("mongoose");

const SavepointSchema = mongoose.Schema({
    userID: String,
    level: Number,
    score: Number,
    position: [Number],
    lifepoints: Number,
    lightpoints: Number
},
{collection: 'savepoints'}
);

module.exports = mongoose.model("savepoint", SavepointSchema);