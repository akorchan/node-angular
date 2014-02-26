'use strict';

var db = require('./db');
var BSON = require('mongodb').BSONPure;

var collectionName = 'unauthorized_users';

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

exports.putVisitorsInfo = function (trackId) {
    if (typeof trackId === "undefined") {
        return;
    }
    var condition = {trackId: trackId};
    db.collection(collectionName, function (err, collection) {
        collection.find(condition).toArray(function (err, users) {
            var user = {};
            if (typeof users[0] !== "undefined") {
                user = users[0];
                var currentDate = new Date().getTime();
                //if time difference is more than 1 hour
                if (currentDate - user.lastVisitDate > 3600000) {
                    user.lastVisitDate = currentDate;
                    user.visitsCount += 1;
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
                db.collection(collectionName, function (err, collection) {
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
};