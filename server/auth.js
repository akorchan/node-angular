'use strict';

//http://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js

exports.login = function (req, res) {
    var post = req.body;
    if (post.user == 'admin' && post.pass == 'admin') {
        req.session.user_id = "admin";
        res.redirect('#/admin');
    } else {
        res.send('Bad user/pass');
    }
};

exports.logout = function (req, res) {
    delete req.session.user_id;
    res.redirect('#/main');
};

exports.checkAuth = function(req, res, next) {
    if (!req.session.user_id) {
        res.send('You are not authorized to view this page');
    } else {
        next();
    }
};
