const express = require("express");
var router = express.Router();
const Score = require("../model/ScoreModel");
const {asyncMiddleware} = require("../middleware/asyncMiddleware");

module.exports = router;

//saves/updates score
router.post("/saveScore", asyncMiddleware(async (req, res) =>{
    let username = req.session.user.username;
    let level = req.body.level;
    let time = req.body.time;
    await Score.findOne({username, level})
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
}))

//get scores
router.get("/getScore", asyncMiddleware(async (req, res) => {
    let level = req.query.level;
    const scores = await Score.find({level, highscore: { $gte: 1 }}, 'username highscore -_id').sort({ highscore: 1}).limit(3);
    res.status(200).json(scores);
}))

