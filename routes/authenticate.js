"use strict"
var express = require('express');
var router = express.Router();
var database = require('../database');
var credential = require('credential');
var jwt = require('jsonwebtoken');
var config = require('../config/auth');

var cred=credential();

/* POST register a new user. */
router.post('/', async function(req, res, next) {
  var email = req.body.email;
  var pwd = req.body.password;
  try{
    var userData = await database.getUserByEmail(email);
  } catch (e) {
    console.log(e);
    return res.json({success: false, message: 'database access failed'});
  }
  if (!userData){
    return res.json({success: false, message: 'User does not exist'});
  }

  var storedHash = userData.password;
  cred.verify(storedHash, pwd, authUser);
  async function authUser(err, isValid){
    if (err) throw err;
    if (isValid){
      const token = await jwt.sign({"email": userData.email}, config.secret, {expiresIn: 604800});
      var authJson = {
        success: true,
        token: 'JWT ' + token,
        user: {
          email: userData.email,
          name: userData.name
        }
      };

      res.json(authJson);
    }
    else {
      return res.json({success: false, message: 'Wrong password'});
    }
  }
});

module.exports = router;
