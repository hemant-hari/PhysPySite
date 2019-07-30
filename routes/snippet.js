var express = require('express');
var router = express.Router();
var database = require('../database');

router.post('/', function(req,res,next){
  console.log("Trying to post")
  res.send("Hey there friendo")
});

router.get('/:id', function(req, res, next){
  console.log("Trying to get snippet with id " + req.params.id);
  res.send("Hey there, you trying to get somewhere?")
});

module.exports = router;
