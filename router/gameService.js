const User = require("../model/UserModel");
const express = require("express");
var router = express.Router();
var path = require("path");
const Savepoint = require("../model/SavepointModel");
const {authMiddleware} = require("../middleware/auth");

module.exports = router;

router.get('/game', authMiddleware, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'Game.html'));
}) 

router.post('/countPlaytimes', (req, res) => {
    const userID = req.session.user._id;
    User.findById(userID)
    .then(user =>{
        user.timesPlayed += 1;
        user.save();
    })
    return res.status(201).json('success'); 
})

router.post('/saveGame', (req, res) => {
    const userID = req.session.user._id;
    let {level, score, position, title, playerHealth, light} = req.body;
    if(!title){
        return res.status(400).json({type: 'error', res: 'no title'});
    }
    Savepoint.find({userID}).sort({updatedAt: 1})
    .then(savepoints =>{
        if(savepoints.length > 2){
            delete savepoints[0].updatedAt;
            savepoints[0].title = title;
            savepoints[0].level = level;
            savepoints[0].score = score;
            savepoints[0].position = position;
            savepoints[0].lifepoints = playerHealth;
            savepoints[0].lightpoints = light;
            savepoints[0].save();
            return res.status(201).json('success'); 
        }else{
            const savepoint = new Savepoint({
                userID: userID,
                title: title,
                level: level,
                score: score,
                position: position,
                lifepoints: playerHealth,
                lightpoints: light
            })
            savepoint.save();
            return res.status(201).json('success'); 
        }
    })
    
}) 

router.get('/loadGame', authMiddleware, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'loadGame.html'));
}) 

router.get('/getSavedGame', async (req, res) => {
    const userID = req.session.user._id;
    let title = req.session.saveTitle;
    if(title){
        const savepoint = await Savepoint.findOne({title, userID}, 'score position lifepoints lightpoints level -_id');
        req.session.saveTitle = null;
        return res.status(201).json(savepoint);
    }
    return res.status(200);
}) 

router.get('/titleSavepoint', async (req, res) => {
    const userID = req.session.user._id;
    const savepointTitle = await Savepoint.find({userID}, 'title -_id');
    return res.status(200).json(savepointTitle);
}) 

router.get('/loadThisSavepoint', async (req, res) => {
    const title = req.query.saveTitle;
    if(title){
        req.session.saveTitle = title;
    }
    return res.status(200).json('success');
})

router.get('/highscore', authMiddleware, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'highscore.html'));
}) 

router.get('/endscreen', authMiddleware, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'Endscreen.html'));
}) 
