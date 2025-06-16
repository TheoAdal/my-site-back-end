// routes/PostRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const checkToken = require('../middleware/checkToken');

router.post("/user/login", async (req, res, next) => {
  const { body } = req;
        const { email } = body;
        const { password } = body;

        const user = await User.findOne({ email });

        //checking to make sure the user entered the correct email/password combo
        if(email === user.email && password === user.password) { 
            //if user log in success, generate a JWT token for the user with a secret key
            jwt.sign({user}, 'privatekey', { expiresIn: '1h' },(err, token) => {
                if(err) { console.log(err) }    
                res.send(token);
                // console.log(token)
            });
        } else {
            console.log('ERROR: Could not log in');
        }
    })


module.exports = router;