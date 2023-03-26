var express = require('express');
const passport = require('passport');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('signup-form');
});

router.post(
    '/', 
    passport.authenticate('local', 
    {
        failureRedirect: 'login-failure', 
        successRedirect: 'login-success',
    }),
    (err, req, res, next) => {
        if (err) next(err);
    }
)
module.exports = router;