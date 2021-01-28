const express = require("express");
var router = express.Router();
const Score = require("../model/ScoreModel");
const db = require("../helpers/db");
const User = db.User;

module.exports = router;

router.post("/saveScore", async function(req, res){
    let userID = req.session.user._id;
    let level = req.body.level;
    let time = req.body.time;
    Score.findOne({userID: userID, level: level})
    .then(score =>{
        if(score){
            score.timescore = time;
            if(score.highscore >= time){
                score.highscore = time;
            }
            score.save();
        }else{
            const newScore = new Score({
                userID: userID,
                level: level,
                timescore: time,
                highscore: time
            })
            newScore.save();
        }
    })
    res.json({type: 'success'});
})

router.get("/getScore", async function(req, res){
    let level = req.query.level;
    const scores = await Score.find({level, highscore: { $gte: 1 }}, 'username highscore -_id').sort({ highscore: 1}).limit(10);
    const users = await User.find({}, 'username email -_id');
    console.log(scores);
    //const names = await User.find({_id: scores.userID});
    res.json(scores)
})