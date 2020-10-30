// moddules for node and express
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// import "mongoose" - required for DB Access
let mongoose = require('mongoose');
// URI
let DB = require('./db');

mongoose.connect(DB.URL, {useNewUrlParser: true, useUnifiedTopology: true})
let dbConnection = mongoose.connection; // alias

dbConnection.on('error', console.error.bind(console, 'Connection Error:'));
dbConnection.once('open', ()=>{
  console.log('Connection OPEN...');
});

dbConnection.once('connected', ()=>{
  console.log('MondoDB CONNECTED...');
});

dbConnection.on('disconnected', ()=>{
  console.log('Connection with MondoDB CLOSED...');
});

dbConnection.on('reconnected', ()=>{
  console.log('Connection with MondoDB REOPEN...');
});


// define routers
let index = require('../routes/index'); // top level routes
let books = require('../routes/books'); // routes for books

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /client
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../client')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// route redirects
app.use('/', index);
app.use('/books', books);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error'
  });
});

module.exports = app;
