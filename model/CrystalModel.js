const mongoose = require("mongoose");

const CrystalSchema = mongoose.Schema({
    _id: Number,
    position: [Number],
    collected: Boolean,
    lifepoints: Number
});

module.exports = mongoose.Model("crystal", CrystalSchema);