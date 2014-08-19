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