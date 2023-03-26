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
		//tghis works
		// const user = new User({
		// 	firstName: req.body.firstName,
		// 	lastName: req.body.lastName,
		// 	username: req.body.username,
		// 	password: req.body.password,
		// 	isMember: false,
		// });
		// user.save()
		// .then((response) => {
		// 	res.render("index");
		// });
		
	},
	passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
	})
];

exports.user_login_get = (req, res, next) => {
    res.render('login');
}

exports.user_login_post = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Login User POST");
}

//for testing
exports.auth_test_get = (req, res, next) => {
	res.send("user authenticated.");
}