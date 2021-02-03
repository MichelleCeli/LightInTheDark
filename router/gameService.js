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
    let {level, score, position, title, playerHealth, light} = req.body;
    const savepoint = new Savepoint({
        userID: userID,
        title: title,
        level: level,
        score: score,
        position: position,
        lifepoints: playerHealth,
        lightpoints: light
    })
    await savepoint.save();
    console.log(savepoint);
    return res.json({type: 'success'});
}) 

router.get('/loadGame', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'loadGame.html'));
}) 

router.get('/getSavedGame', async (req, res) => {
    const userID = req.session.user._id;
    let title = req.session.saveTitle;
    console.log(title);
    if(title){
        const savepoint = await Savepoint.findOne({title, userID}, 'score position lifepoints lightpoints -_id');
        req.session.saveTitle = null;
        return res.json(savepoint);
    }
    return;
}) 

router.get('/titleSavepoint', async (req, res) => {
    const userID = req.session.user._id;
    const savepointTitle = await Savepoint.find({userID}, 'title -_id');
    return res.json(savepointTitle);
}) 

router.get('/loadThisSavepoint', async (req, res) => {
    const title = req.query.saveTitle;
    if(title){
        req.session.saveTitle = title;
    }
    return res.json('success');
})