const User = require("../model/UserModel");
const express = require("express");
var router = express.Router();
var path = require("path");
const Savepoint = require("../model/SavepointModel");
const {authMiddleware} = require("../middleware/auth");
const {asyncMiddleware} = require("../middleware/asyncMiddleware");

module.exports = router;

//game page
router.get('/game', authMiddleware, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'Game.html'));
}) 

//counter for played games
router.post('/countPlaytimes', asyncMiddleware(async(req, res) => {
    const userID = req.session.user._id;
    await User.findById(userID)
    .then(user =>{
        user.timesPlayed += 1;
        user.save();
    })
    return res.status(201).json('success'); 
}))

//save game
router.post('/saveGame', asyncMiddleware(async(req, res) => {
    const userID = req.session.user._id;
    let {level, score, position, title, playerHealth, light} = req.body;
    if(!title){
        return res.status(400).json({type: 'error', res: 'no title'});
    }
    await Savepoint.find({userID}).sort({updatedAt: 1})
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
    
})) 

//load game page
router.get('/loadGame', authMiddleware, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'loadGame.html'));
}) 

//loads savepoint if possible
router.get('/getSavedGame', asyncMiddleware(async (req, res) => {
    const userID = req.session.user._id;
    let title = req.session.saveTitle;
    if(title){
        const savepoint = await Savepoint.findOne({title, userID}, 'score position lifepoints lightpoints level -_id');
        req.session.saveTitle = null;
        return res.status(201).json(savepoint);
    }
    return res.status(200);
})) 

//gets savepoint titles
router.get('/titleSavepoint', asyncMiddleware(async (req, res) => {
    const userID = req.session.user._id;
    const savepointTitle = await Savepoint.find({userID}, 'title -_id');
    return res.status(200).json(savepointTitle);
})) 

//sets which savepoint to load
router.get('/loadThisSavepoint', (req, res) => {
    const title = req.query.saveTitle;
    if(title){
        req.session.saveTitle = title;
    }
    return res.status(200).json('success');
})

//highscore page
router.get('/highscore', authMiddleware, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'highscore.html'));
}) 

//endscreen
router.get('/endscreen', authMiddleware, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'Endscreen.html'));
}) 
