"use strict"
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

//Routers
var snippetRouter = require('./routes/snippet');

//Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var app = express();

// Static file serving
app.use(express.static('public'));

app.use('/snippet', snippetRouter);

app.get('/', helloWorld);
function helloWorld(req, res){
  res.sendFile('public/index.html');
}

app.listen(8000, () => console.log('listening on port 8000'));
