"use strict"
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', helloWorld);
function helloWorld(req, res){
  res.sendFile('public/index.html');
}

app.listen(40, () => console.log('listening on port 8000'));
