const mongoose = require("mongoose");

const SavepointSchema = mongoose.Schema({
    _id: Number,
    userID: Number,
    score: Number,
    position: [Number],
    lifepoints: Number,
    lightpoints: Number
});

module.exports = mongoose.Model("savepoint", SavepointSchema);