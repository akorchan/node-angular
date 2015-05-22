'use strict';

var db = require('./db');
var BSON = require('mongodb').BSONPure;

var configCollection = "config";

exports.getConfig = function (timeout, callback) {
    setTimeout(function () {
        db.collection(configCollection, function (err, collection) {
            collection.find().toArray(function (err, values) {
                console.log("Config loaded successfully");
                callback(values[0]);
            });
        })
    }, timeout);
};

exports.getCurrencyRate = function (req, res) {
    setTimeout(function () {
        db.collection(configCollection, function (err, collection) {
            collection.find().toArray(function (err, values) {
                res.send(values[0].coef);
            });
        })
    }, 1000);
};

exports.setCurrencyRate = function (req, res) {
    var newRate = 1;
    if (typeof req.body.rate !== "undefined") {
        newRate = req.body.rate;
    }
    db.collection(configCollection, function (err, collection) {
        collection.findAndModify(
            {admin_login: 'admin'}, // query
            [
                ['_id', 'asc']
            ],  // sort order
            {$set: {coef: newRate}}, // replacement, replaces only the field "hi"
            {}, // options
            function (err, object) {
                if (err) {
                    console.warn(err.message);  // returns error if no matching object found
                } else {
                    res.send(object.coef)
                }
            });
    });

};
