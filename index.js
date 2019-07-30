"use strict"
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');

//Routers
var snippetRouter = require('./routes/snippet');
var registerRouter = require('./routes/register');
var authenticateRouter = require('./routes/authenticate');

var app = express();

//Middleware
app.use(cors({credentials: true, origin: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Set up passport.js for login verification
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Static file serving
app.use(express.static('public'));

//use routers
app.use('/snippet', snippetRouter);
app.use('/register', registerRouter);
app.use('/authenticate', authenticateRouter);

app.get('/', helloWorld);
function helloWorld(req, res){
  res.sendFile('public/index.html');
}

app.listen(8000, () => console.log('listening on port 8000'));
