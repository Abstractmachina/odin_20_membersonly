var express = require('express');
var router = express.Router();

const userController = require("../controllers/userController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', userController.user_create_get);
router.post('/signup', userController.user_create_post);

router.get('/login', userController.user_login_get);
router.post('/login', userController.user_login_post);


module.exports = router;
