const User = require("../model/UserModel");
const express = require("express");
var router = express.Router();
var path = require("path");
const Savepoint = require("../model/SavepointModel");
const {authMiddleware} = require("../middleware/auth");

module.exports = router;

router.get('/game', authMiddleware, (req, res) => {
    const userID = req.session.user._id;
    User.findById(userID)
    .then(user =>{
        user.timesPlayed += 1;
        user.save();
    })
    res.sendFile(path.join(__dirname, '../public', 'Game.html'));
}) 

//router.post('/countPlaytimes')

router.post('/saveGame', (req, res) => {
    const userID = req.session.user._id;
    let {level, score, position, title, playerHealth, light} = req.body;
    if(!title){
        return res.json({type: 'error', res: 'no title'});;
    }
    Savepoint.find({userID})
    .then(savepoint =>{
        if(savepoint.length > 2){
            res.json({type: 'error', res: 'too many savepoints'});
            return;
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
            return res.json('success'); 
        }
    })
    
}) 

router.post('/deleteSavepoint', async(req,res) =>{

})

router.get('/loadGame', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'loadGame.html'));
}) 

router.get('/getSavedGame', async (req, res) => {
    const userID = req.session.user._id;
    let title = req.session.saveTitle;
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

router.get('/highscore', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'highscore.html'));
}) 
