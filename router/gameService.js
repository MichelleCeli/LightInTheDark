const db = require("../helpers/db");
const User = db.User;
const express = require("express");
var router = express.Router();
const config = require("../helpers/config");
var path = require("path");
const Savepoint = require("../model/SavepointModel");
const {authMiddleware} = require("../middleware/auth");

module.exports = router;

router.get('/game', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'Game.html'));
}) 

router.get('/highscore', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'highscore.html'));
}) 

router.post('/saveGame', async (req, res) => {
    const userID = req.session.user._id;
    let {level, score, position} = req.body;
    const savepoint = new Savepoint({
        userID: userID,
        level: level,
        score: score,
        position: position
    })
    await savepoint.save();
    console.log(savepoint);
    return res.json({type: 'success'});
}) 