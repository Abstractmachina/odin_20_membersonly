
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const xhbs = require("express-handlebars");

//authentication
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require('bcryptjs');
const MongoStore =require('connect-mongo');

const User = require('./models/user');

require("dotenv").config();

var app = express();

// ------------	view engine setup	--------------------------
app.engine('handlebars', xhbs.engine({
  extname : "hbs",
  defaultLayout : false,
  layoutsDir : path.join(__dirname, "views"),
  partialsDir: path.join(__dirname, "views/partials"),
}));
app.set('view engine', 'handlebars');
app.set('views','views');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// set up rate limit
var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 1*60*1000,
  max:20,
});
app.use(limiter);


app.use(express.urlencoded({ extended: false }));



//-------------	Connect to database	--------------------------

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const connect = async () => {
	mongoose.connect(process.env.MONGODB_AUTH, {
		useNewUrlParser: true,
		useUnifiedTopology:true
	});
	const db = mongoose.connection;
	db.on("error", () => {
		console.log("could not connect");
	});
	db.once("open", () => {
		console.log("> Successfully connected to database");
	});
}

connect();

// -----------------	PASSPORT SETUP	-----------------------------------
//helper function for checking if password is correct
const isValidPassword = (user, InputPassword) => {
	const compareHash = bcryptjs.hash(InputPassword, process.env.SALT_ROUNDS);
	return bcryptjs.compare(user.hash, compareHash);
}

passport.use(
	"local-signup",
	new LocalStrategy(
		{
			passReqToCallback: true,
		},	
		(req, username, password, done) => {
			process.nextTick(() => {
				//check if user exists
			User.findOne({username: username})
			.then((user) => {
				if (user) return done(null, false);
				
				//create new user
				const newUser = new User({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					username: username,
					password: password,
					isMember: false,
				});
				console.log("dddddd");
				console.log(newUser);
				newUser.save()
				.then((user) => {
					return done(null, user);
				});


				// User.create({username, password })
				// .then((user) => {
				// 	return done(null, user);
				// });
			})
			.catch ((err) => {
				console.log(err);
				return done(err);
			});
		});	
	})
);
passport.use(
	"local-login",
	new LocalStrategy(
		(username, password, done) => {
			//check if user exists
			User.findOne({username: username})
			.then((user) => {
				if (!user) {
					return done(null, false, {message: "Incorrect username" });
				}
				const isMatch = user.matchPassword(password);
				isMatch.then(() => {
					if (!this) {
						return done(null, false, {message: "Incorrect passwordd" });
					}
					return done(null, user);
				});
			})
			.catch ((err) => {
				console.log(err);
				return done(err);
			});
	})
);
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});


// ------------------	SESSION SETUP	-------------------------------


// const sessionStore = MongoStore.create({mongooseConnection: connection, collection: 'sessions'});

//authentication
app.use(session({ 
	secret: process.env.SECRET, 
	resave: false, 
	saveUninitialized: true,
	// store: sessionStore,
	cookie: {
		maxAge: 1000 * 30
	}
}));
app.use(passport.initialize());
app.use(passport.session());



// //make user variable available to whole app
// app.use(function(req, res, next) {
//     res.locals.currentUser = req.user;
//     next();
// });

// -------------------------	ROUTES	---------------------------------
const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
// const loginRouter = require('./routes/login');
app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/login', loginRouter);




// mongoose.set('strictQuery', false);
// const mongoDB = process.env.MONGODB_AUTH;

// main().catch(err => console.log(err));
// async function main() {
//   await mongoose.connect(mongoDB);
// }


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

exports.isLoggedIn = (req, res, next) => {
	//if user is authenticated, carry on
	if (req.user) return next();
	//if not, redirect to login page.
	else res.redirect('/login');
}

module.exports = app;
