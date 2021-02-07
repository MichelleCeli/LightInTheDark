const express = require("express");
var router = express.Router();
const Score = require("../model/ScoreModel");

module.exports = router;

router.post("/saveScore", async function(req, res){
    let username = req.session.user.username;
    let level = req.body.level;
    let time = req.body.time;
    Score.findOne({username, level})
    .then(score =>{
        if(score){
            score.timescore = time;
            if(score.highscore >= time || score.highscore == 0){
                score.highscore = time;
            }
            score.save();
        }else{
            const newScore = new Score({
                username: username,
                level: level,
                timescore: time,
                highscore: time
            })
            newScore.save();
        }
    })
    res.status(201).json({type: 'success'});
})

router.get("/getScore", async function(req, res){
    let level = req.query.level;
    const scores = await Score.find({level, highscore: { $gte: 1 }}, 'username highscore -_id').sort({ highscore: 1}).limit(3);
    res.status(200).json(scores);
})

