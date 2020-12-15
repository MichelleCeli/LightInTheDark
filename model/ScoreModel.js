const mongoose = require("mongoose");

const ScoreSchema = mongoose.Schema({
    _id: Number,
    userID: Number,
    timescore: Number,
    highscore: Number
});

module.exports = mongoose.Model("score", ScoreSchema);