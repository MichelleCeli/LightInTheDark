const mongoose = require("mongoose");

const SavepointSchema = mongoose.Schema({
    userID: String,
    level: Number,
    score: Number,
    position: [Number],
    lifepoints: Number,
    lightpoints: Number
},
{collection: 'savepints'}
);

module.exports = mongoose.Model("savepoint", SavepointSchema);