"use strict"
var express = require('express');
var router = express.Router();
var database = require('../database');
var credential = require('credential');

var cred=credential();

/* POST register a new user. */
router.post('/', function(req, res, next) {
  var name = req.body.first + " " + req.body.last;
  var pwd = req.body.password;
  var email = req.body.email;
  //var pwdReqs = //;

  console.log(req.body);

  cred.hash(pwd, registerUser);
  async function registerUser(err, hashedPassword){
    if(err){
      res.json({success: false, msg: 'Failed to encrypt password for storage'});
    }
    else{
      try{
        var ret = await database.createUser(email, hashedPassword, name);
        res.json({success: true, msg: 'User created successfully'});
      } catch (e) {
        console.log(e);
        res.json({success: false, msg: 'Failed to create user'});
      }
     }
  }
});

module.exports = router;
