'use strict';

var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;

var databaseName = 'heroku_app18084336';

var server = new Server('ds043368.mongolab.com', 43368, {auto_reconnect: true});
var db = new Db(databaseName, server);

var dbLogin = "buona";
var dbPass = "buona";

var csv = require('csv');

db.open(function (err, db) {
    //authentication process
    db.authenticate(dbLogin, dbPass, function (err, result) {
        if (!result) {
            db.close();
        }
        var csvfile = "test.txt";

        csv().from.path(csvfile, { columns: true, delimiter: "\t" }).on('record', function (data, index) {
            // do some work here
            console.log(data);
            var region = {};
            region.code = data.id;
            region.city = data.city;
            region.district = data.district;
            region.region = data.region;
            region.lat = data.lat;
            region.lon = data.lon;
            db.collection("regions", function (err, collection) {
                    collection.insert(region, {safe: true}, function (err, result) {
                            if (err) {
                                console.log("error");
                            } else {
                                console.log("success");
                            }
                        }
                    );
                }
            );


        });
    });
    if (!err) {
        console.log("Connected to '" + databaseName + "' database");
    }
});

module.exports = db;