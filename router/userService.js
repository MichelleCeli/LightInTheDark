const bcrypt = require("bcrypt");
const db = require("../helpers/db");
const User = db.User;
const express = require("express");
var router = express.Router();
const config = require("../helpers/config");
var path = require("path");
const ScoreModel = require("../model/ScoreModel");
//var authMiddleware = require("../middleware/auth");

module.exports = router;

router.post("/login", async function(req, res){
    let {username, password} = req.body;
    User.findOne({username})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(error, result){
                if(error){
                    return res.json({type: 'error', res: 'Error occurred'});
                }
                if(result){
                    req.session.user = user;
                    return res.json({type: 'success'});
                }else{
                    return res.json({type: 'error', res: 'Wrong password'});
                }
            })
        }else{
            res.json({type: 'error', res: 'User not existing'});
        }
    })
 })

router.post("/register", async function(req, res){
    //try {
        let {username, email, password, passwordAgain } = req.body;
        if(await User.findOne({email})){
            return res.json({type: 'error', div: 'messageMail', res: "This email already exists"});
        }
        if(!email){
            return res.json({type: 'error', div: 'messageMail', res: 'Enter an email'})
        }
        if(await User.findOne({username})){
            return res.json({type: 'error', div: 'messageUser', res: "This username already exists"});
        }
        if(!username){
            return res.json({type: 'error', div: 'messageUser', res: 'Enter an username'});
        }
        if(!password){
            return res.json({type: 'error', div: 'messagePassword', res: 'Enter a password'});
        }
        if(password !== passwordAgain){
            return res.json({type: 'error', div: 'messagePasswordRepeat', res: 'Passwords not the same'});
        }
        var hashedPassword = bcrypt.hashSync(req.body.password, 5);
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword
        })

        await user.save()
        req.session.user = user;

        const score = new ScoreModel({
            username: user.username,
            level: 1,
            timescore: 65,
            highscore: 65
        })

        await score.save();

        return res.json({type: 'success'});
        
    //} catch (error) {
    //    return res.status(500).send({ message: 'Fehler' });
   // }

})

router.post('/save', async function(req, res){

})

router.get('/logout', async function(req, res){
    if(req.session.user) {
        req.session.destroy();
        console.log("logout");
        res.json("logout");
    } else {
        res.redirect('/');
    }        
}); 

const authMiddleware = function(req, res, next){
    if(!req.session.user){
        return res.redirect("/login");
    }
    return next();
}

/* router.get('/menu', authMiddleware, async function(req, res){
    console.log("go to menu");
    res.sendFile(path.join(__dirname, '../public', 'Menu.html'));
}) */
 
