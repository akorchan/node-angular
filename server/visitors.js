'use strict';

var db = require('./db');
var BSON = require('mongodb').BSONPure;

var collectionVisitors = 'unauthorized_users';
var collectionRegions = 'regions';

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

exports.putVisitorsInfo = function (trackId, ip, country, regionCode) {
    if (typeof trackId === "undefined") {
        return;
    }
    var condition = {trackId: trackId};
    getRegionDetails(regionCode, function (regionByCode) {
        db.collection(collectionVisitors, function (err, collection) {
            collection.find(condition).toArray(function (err, users) {
                var user = {};
                if (typeof users[0] !== "undefined") {
                    user = users[0];
                    var currentDate = new Date().getTime();
                    //if time difference is more than 1 hour
                    if (currentDate - user.lastVisitDate > 3600000) {
                        user.lastVisitDate = currentDate;
                        user.visitsCount += 1;
                        if (user.addresses.indexOf(ip) === -1) {
                            user.addresses.push(ip);
                            var isNeedToBeAdded = true;
                            for (var i in user.regions) {
                                if (user.regions[i].city === regionByCode.city) {
                                    isNeedToBeAdded = false;
                                }
                            }
                            if (isNeedToBeAdded) {
                                var region = {};
                                region.country = country;
                                region.city = regionByCode.city;
                                region.district = regionByCode.district;
                                user.regions.push(region);
                            }
                        }
                        collection.update({'_id': new BSON.ObjectID(encode_utf8(user._id))}, user, {safe: true}, function (err, result) {
                                if (err) {
                                    // do nothing
                                } else {
                                    // do nothing
                                }
                            }
                        );
                    }
                } else {
                    user.trackId = trackId;
                    user.lastVisitDate = new Date().getTime();
                    user.visitsCount = 1;
                    user.addresses = [];
                    user.addresses.push(ip);
                    user.regions = [];
                    var region = {};
                    region.country = country;
                    region.city = regionByCode.city;
                    region.district = regionByCode.district;
                    user.regions.push(region);
                    db.collection(collectionVisitors, function (err, collection) {
                            collection.insert(user, {safe: true}, function (err, result) {
                                    if (err) {
                                        // do nothing
                                    } else {
                                        // do nothing
                                    }
                                }
                            );
                        }
                    );
                }
            });
        });
    });
};

exports.getUnauthorizedVisitors = function (req, res) {
    db.collection(collectionVisitors, function (err, collection) {
        collection.find().sort("visitsCount", -1,function () {
        }).skip(parseInt(req.query.startFrom)).limit(parseInt(req.query.number)).toArray(function (err, users) {
                res.send(users);
            });
    });
};

function getRegionDetails(regionCode, callback) {
    db.collection(collectionRegions, function (err, collection) {
        collection.find({code: regionCode.toString()}).toArray(function (err, regions) {
            if (typeof regions[0] === "undefined") {
                regions[0] = {};
                regions[0].city = "Неизвестный город";
                regions[0].district = "";
            } else if (regions[0].city === regions[0].district) {
                regions[0].district = "";
            }
            callback(regions[0]);
        });
    });
}