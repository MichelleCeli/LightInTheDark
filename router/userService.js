const bcrypt = require("bcrypt");
const User = require("../model/UserModel");
const express = require("express");
var router = express.Router();
var path = require("path");
const ScoreModel = require("../model/ScoreModel");
const {authMiddleware} = require("../middleware/auth");

module.exports = router;

router.get('/', async function(req, res){
    res.status(200).redirect('/login');
}) 

router.get('/login', async function(req, res){
    res.status(200).sendFile(path.join(__dirname, '../public', 'LogIn.html'));
}) 

router.post("/login", async function(req, res){
    let {username, password} = req.body;
    User.findOne({username})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(error, result){
                if(error){
                    return res.status(500).json({type: 'error', res: 'Error occurred'});
                }
                if(result){
                    req.session.user = user;
                    return res.status(201).json({type: 'success'});
                }else{
                    return res.status(401).json({type: 'error', res: 'Wrong password'});
                }
            })
        }else{
            res.status(401).json({type: 'error', res: 'User not existing'});
        }
    })
 })

router.get('/register', async function(req, res){
    res.status(200).sendFile(path.join(__dirname, '../public', 'SignIn.html'));
}) 

router.post("/register", async function(req, res){
    try {
        let {username, email, password, passwordAgain } = req.body;
        if(await User.findOne({email})){
            return res.status(400).json({type: 'error', div: 'messageMail', res: "This email already exists"});
        }
        if(!email){
            return res.status(400).json({type: 'error', div: 'messageMail', res: 'Enter an email'})
        }
        if(await User.findOne({username})){
            return res.status(400).json({type: 'error', div: 'messageUser', res: "This username already exists"});
        }
        if(!username){
            return res.status(400).json({type: 'error', div: 'messageUser', res: 'Enter an username'});
        }
        if(!password){
            return res.status(400).json({type: 'error', div: 'messagePassword', res: 'Enter a password'});
        }
        if(password.length < 5){
            return res.status(400).json({type: 'error', div: 'messagePassword', res: 'Password min 5 characters'});
        }
        if(password !== passwordAgain){
            return res.status(400).json({type: 'error', div: 'messagePasswordRepeat', res: 'Passwords not the same'});
        }
        var hashedPassword = bcrypt.hashSync(req.body.password, 5);
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword,
            timesPlayed: 0
        })

        await user.save();
        req.session.user = user;

        const score = new ScoreModel({
            username: user.username,
            level: 1,
            timescore: 0,
            highscore: 0
        })

        await score.save();

        return res.status(201).json({type: 'success'});
        
    } catch (error) {
        return res.status(500).send({ message: 'Error' });
    }

})

router.get('/logout', async function(req, res){
    if(req.session.user) {
        req.session.destroy();
        res.status(201).json("logout");
    }      
}); 

router.get('/menu', authMiddleware, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'Menu.html'));
}) 
 

router.get('/profile', authMiddleware, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'Profile.html'));
}) 

router.get('/changePassword', authMiddleware, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'changePassword.html'));
}) 

router.post('/changePassword', (req, res) => {
    let userID = req.session.user._id;
    let newPassword = req.body.password;
    let repeatNewPassword = req.body.passwordRepeat;
    if(newPassword !== repeatNewPassword){
        return res.json('error');
    }
    if(newPassword.length < 5){
        return res.json('too short');
    }
    User.findById(userID)
    .then(user =>{
        var hashedPassword = bcrypt.hashSync(newPassword, 5);
        user.password = hashedPassword;
        user.save();
    })
    res.status(201).json('success');
})

router.get('/getProfileData', async (req, res) => {
    const userID = req.session.user._id;
    const username = req.session.user.username;
    const user = await User.findById(userID, 'username timesPlayed -_id');
    const scores = await ScoreModel.find({username}, 'level timescore highscore -_id');
    res.status(200).json({user, scores});
})