const mongoose = require("mongoose");

const ScoreSchema = mongoose.Schema({
    username: String,
    level: Number,
    timescore: Number,
    highscore: Number
},
{collection: 'scores'}
);

module.exports = mongoose.model("score", ScoreSchema);