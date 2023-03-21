const User = require('../models/user');
const {body, validationResult} = require ('express-validator');

exports.user_create_get = (req, res, next) => {
	res.render('signup-form')
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
	body("lastName")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("User name must be specified.")
		.isAlphanumeric()
		.withMessage("User name has non-alphanumeric characters."),
		body('password', "Invalid Password").isStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
			returnScore: false,
			pointsPerUnique: 1,
			pointsPerRepeat: 0.5,
			pointsForContainingLower: 10,
			pointsForContainingUpper: 10,
			pointsForContainingNumber: 10,
			pointsForContainingSymbol: 10,
		  }),
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

		const user = new User({
			firstname: req.body.firstName,
			lastName: req.body.lastname,
			password_temp
		})
	}
];

exports.user_login_get = (req, res, next) => {
    res.render('login');
}

exports.user_login_post = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Login User POST");
}