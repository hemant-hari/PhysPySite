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
app.use('/api/snippet', snippetRouter);
app.use('/api/register', registerRouter);
app.use('/api/authenticate', authenticateRouter);

app.get('/', entryPoint);
function entryPoint(req, res){
  console.log("here I am buddy boy");
  res.sendFile('public/app.html');
}

app.listen(8000, () => console.log('listening on port 8000'));
