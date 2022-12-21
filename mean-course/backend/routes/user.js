const express = require("express");

// Import the hashing plugin
const bcrypt = require("bcrypt")
// import package to create webtokens
const jwt = require("jsonwebtoken")

// Import the user template
const User = require("../models/user");


const router = express.Router()



router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: "User created",
            result: result
            });
          })
        .catch(err => {
            res.status(500).json({
              error: err
            })
        })

    });


});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  console.log("Inside function for /login")
  // Finds a user in the database
  User.findOne({ email: req.body.email}).then(user => {
    console.log("This is the user returned from mongo " + user)
    if (!user) {
      console.log("Inside the if !user")
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    fetchedUser = user
    // Compare imput to an encrypted value
    return bcrypt.compare(req.body.password, user.password);

    })
    .then(result => {
      console.log(fetchedUser.email)
      console.log(fetchedUser._id)
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        })
      }
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
        'secret_this_should_be_longer',
        {expiresIn: '1h'}
      );
      console.log(token)
      res.status(200).json({
        message: "login success",
        token: token,
        expiresIn: 3600
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed - all error catch"
      })
    })



})

module.exports = router
