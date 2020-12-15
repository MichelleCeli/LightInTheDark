const mongoose = require("mongoose");

const FireflySchema = mongoose.Schema({
    _id: Number,
    position: [Number],
    collected: Boolean,
    lightpoints: Number
});

module.exports = mongoose.Model("firefly", FireflySchema);