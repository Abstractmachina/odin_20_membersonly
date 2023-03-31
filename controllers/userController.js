require("dotenv").config();

const User = require('../models/user');
const {body, validationResult} = require ('express-validator');
const bcrypt = require('bcryptjs');
const passport = require("passport");


exports.user_create_get = (req, res, next) => {
	res.render('signup-form');
    // res.send("NOT IMPLEMENTED: Create User GET");
}

exports.user_create_post = [
    // Validate and sanitize fields.
	body("firstName")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("First name must be specified.")
		.isAlphanumeric()
		.withMessage("First name has non-alphanumeric characters."),
	body("lastName")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Last name must be specified.")
		.isAlphanumeric()
		.withMessage("Last name has non-alphanumeric characters."),
	body("username")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Username must be specified.")
		.isAlphanumeric()
		.withMessage("User name has non-alphanumeric characters."),
	body('password', "Invalid Password"),
	(req, res, next) => {
		const errors = validationResult(req);
		
		if (!errors.isEmpty()) {
			res.render("signup-form", {
				title: "Create User",
				user: req.body,
				errors: errors.array(),
			});
			return;
		}
		next();		
	},
	passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true,
	})
];

exports.user_login_get = (req, res, next) => {
    res.render('login');
}

exports.user_login_post = [
	(req, res, next) => {
		next();
	},
	passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})
];

exports.user_logout = (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		res.redirect('/');
	});
}

exports.member_signup_get = (req, res, next) => {
	res.render('member-form');
}

exports.member_signup_post = async (req, res, next) => {
	try{
		const user = req.user;
		//user is not logged in
		if (!user) {
			res.redirect('/login');
		}
		console.log(user);
		console.log(req.body.accessCode);
	
		if (req.body.accessCode == process.env.MEMBER_ACCESS_CODE) {
			console.log("correct!");

			user.isMember = true;
			await user.save();
			res.redirect('/');
	
		}
		// if (req.user.becomeMember(req.body.accessCode)){
		// 	//member access was successful. redirect to homepage to see full msg status
		// 	req.user.save();
		// 	res.redirect('/');
			
		// }
		//incorrect access code
		else {res.redirect('/member')}

	} catch(err) {

	}
}

//for testing
exports.auth_test_get = (req, res, next) => {
	const user = req.user;
	console.log(user);
	res.render('auth-test', {user: req.user.toJSON()}); //need to convert to json object first to read, as mongoose models are classes.
}