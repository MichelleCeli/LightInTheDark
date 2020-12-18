const mongoose = require("mongoose");

const MonsterSchema = mongoose.Schema({
    _id: Number,
    life: Number,
    attack: Number,
    alive: Boolean,
    position: [Number]
});

module.exports = mongoose.Model("monster", MonsterSchema);