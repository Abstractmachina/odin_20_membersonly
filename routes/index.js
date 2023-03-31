var express = require('express');
var router = express.Router();

// const {isLoggedIn} = require('../app');

 const isLoggedIn = (req, res, next) => {
	//if user is authenticated, carry on
	if (req.user) return next();
	//if not, redirect to login page.
	else res.redirect('/login');
}

const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , user: req.user});
});

router.get('/signup', userController.user_create_get);
router.post('/signup', userController.user_create_post);

router.get('/login', userController.user_login_get);
router.post('/login', userController.user_login_post);

router.get('/auth-test', isLoggedIn, userController.auth_test_get);

router.get('/logout', userController.user_logout);

router.get('/member', userController.member_signup_get);
router.post('/member', userController.member_signup_post);

router.get('/newMessage', messageController.message_create_get);
router.post('/newMessage', messageController.message_create_post);


module.exports = router;
