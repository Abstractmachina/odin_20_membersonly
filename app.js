require("dotenv").config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const xhbs = require("express-handlebars");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.engine('handlebars', xhbs.engine({
  extname : "hbs",
  defaultLayout : false,
  layoutsDir : path.join(__dirname, "views"),
  partialsDir: path.join(__dirname, "views/partials"),
}));
// expressHandlebars.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'handlebars');
// app.engine('handlebars', xhbs.engine({
// 	extname : "hbs",
// 	defaultView: 'index',
// 	defaultLayout : 'main',
// 	layoutsDir : "views/layouts",
// 	// partialsDir: path.join(__dirname, "views/partials"),
// }));

// app.set('view engine', 'handlebars');
app.set('views','views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//set up rate limit
// var RateLimit = require('express-rate-limit');
// var limiter = RateLimit({
//   windowMs: 1*60*1000,
//   max:20,
// });
// app.use(limiter);

app.use('/', indexRouter);
app.use('/users', usersRouter);



//__________________setup mongoose  _________________________
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_AUTH;

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}


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
	  res.render('error2', {message: err.message});
	// res.send("error");
	console.log(err.message);
});

module.exports = app;
