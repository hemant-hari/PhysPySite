"use strict"
var express = require('express');
var app = express();

app.get('/', helloWorld);
function helloWorld(req, res){
  res.send('Hello World!');
}

app.listen(40, () => console.log('listening on port 3000'));
