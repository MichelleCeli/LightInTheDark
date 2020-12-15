const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../helpers/db");
const User = db.User;
const express = require("express");
var router = express.Router();
const config = require("../helpers/config");

module.exports = router;

router.post("/login", async function(req, res){
    let {username, password} = req.body;
    User.findOne({username})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(error, result){
                if(error){
                    return res.status(500).send({ message: err });
                }
                if(result){
                    var token = jwt.sign({id: user._id}, config.secret, {expiresIn: 86400});
                    /* res.status(200).send({
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        accessToken: token
                    }); */
                    return res.redirect('Menu.html');
                }else{
                    res.json({message: "Passwort stimmt nicht"});
                }
            })
        }else{
            //res.json({message: "Diesen User gibt es nicht"});
            res.status(500);
        }
    })
 })

router.post("/register", async function(req, res){
    //try {
        let {username, email, password, passwordAgain } = req.body;
        if(await User.findOne({username})){
            return res.json({message: "Dieser Username ist vergeben"});
        }
        if(!username){
            return res.json({status: 'error', error: 'Gib einen Usernamen an'})
        }
        if(!password){
            return res.json({status: 'error', error: 'Gib ein Passwort an'})
        }
        if(password !== passwordAgain){
            return res.json({status: 'error', error: 'Das Passwort stimmt nicht überein'})
        }
        var hashedPassword = bcrypt.hashSync(req.body.password, 5);
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword
        })

        var token = jwt.sign({id: user._id}, config.secret, {expiresIn: 86400});

        await user.save()

        //res.status(200).send({token: token});
        return res.redirect('Menu.html');
        
    //} catch (error) {
    //    return res.status(500).send({ message: 'Fehler' });
   // }

})

router.post('/save', async function(req, res){

})

/* router.post('/change-password', (req, res) => {
    const {token} = req.headers['x-access-token'];
    jwt.verify(token, config.secret)

    
}) */