'use strict';

var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;

var databaseName = 'heroku_app18084336';

var server = new Server('ds043368.mongolab.com', 43368, {auto_reconnect: true});
var db = new Db(databaseName, server);

var dbLogin = "buona";
var dbPass = "buona";

db.open(function (err, db) {
    //authentication process
    db.authenticate(dbLogin, dbPass, function (err, result) {
        if (!result) {
            db.close();
        }
    });
    if (!err) {
        console.log("Connected to '" + databaseName + "' database");
    }
});

module.exports = db;