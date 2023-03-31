const Message = require('../models/message');

exports.message_create_get = (req, res, next) => {
    res.render('message-form', {user: req.user});
}

exports.message_create_post = (req, res, next) => {
    
}