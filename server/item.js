'use strict';

var mongo = require('mongodb');
var fs = require('fs');
var path = require('path');
var dbox = require('./dbox');
var uuid = require('node-uuid');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var databaseName = 'heroku_app18084336';
var collectionName = 'items';

var server = new Server('ds043368.mongolab.com', 43368, {auto_reconnect: true});
var db = new Db(databaseName, server);

db.open(function (err, db) {
    //authentication process
    db.authenticate('buona', 'buona', function (err, result) {
        if (!result) {
            db.close();
        }
    });
    if (!err) {
        console.log("Connected to '" + databaseName + "' database");
    }
});

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

exports.getAllItemsByType = function (req, res) {
    var condition = {};
    if (req.query.type !== "") {
        condition = {type: req.query.type};
    }
    db.collection(collectionName, function (err, collection) {
        collection.find(condition).sort("date", -1,function () {
        }).limit(parseInt(req.query.number)).toArray(function (err, items) {
                res.send(items);
            });
    });
};

exports.findItemById = function (req, res) {
    var id = req.params.id;
    console.log('Retrieving item: ' + id);
    db.collection(collectionName, function (err, collection) {
        collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, item) {
            res.send(item);
        });
    });
};

exports.addOrUpdateItem = function (req, res) {
    var item = JSON.parse(req.body.object);
    item.date = new Date().getTime();
    var files = req.files;
    if (item._id) {
        updateItem(item, files,
            function (createdItem) {
                res.send(createdItem);
            },
            function () {
                res.send({'error': 'An error has occurred'});
            });
    } else {
        addItem(item, files,
            function (createdItem) {
                res.send(createdItem);
            },
            function () {
                res.send({'error': 'An error has occurred'});
            });
    }

};

function addItem(item, files, successful, failure) {
    db.collection(collectionName, function (err, collection) {
            collection.insert(item, {safe: true}, function (err, result) {
                    if (err) {
                        failure();
                    } else {
                        console.log('Success: ' + JSON.stringify(result[0]));
                        result[0].images = [];
                        for (var i in files) {
                            files[i].name = encode_utf8(result[0]._id) + "_" + uuid.v1() + ".jpg";
                            result[0].images.push(files[i].name);
                        }
                        collection.update({'_id': new BSON.ObjectID(encode_utf8(result[0]._id))}, result[0], {safe: true}, function (err, result) {
                                if (err) {
                                    console.log('Error updating item: ' + err);
                                    failure();
                                } else {
                                    console.log('' + result + ' document(s) updated');
                                    for (var file in files) {
                                        for (var image in item.images) {
                                            if (item.images[image] === files[file].name) {
                                                dbox.addFile(files[file], files[file].name, function () {
                                                    //do nothing
                                                });
                                            }
                                        }
                                    }
                                    successful(result[0]);
                                }
                            }
                        );
                    }
                }
            );
        }
    );
}

function updateItem(item, files, successful, failure) {
    var id = item._id;
    delete item._id;
    console.log('Updating item: ' + id);
    console.log(JSON.stringify(item));
    var updateProcess = function (updatedItem, filesToDelete, newFiles) {
        db.collection(collectionName, function (err, collection) {
            for (var i in newFiles) {
                var newFileName = id.toString() + "_" + uuid.v1() + ".jpg";
                updatedItem.images.push(newFileName);
                newFiles[i].imageName = newFileName;
            }
            collection.update({'_id': new BSON.ObjectID(id)}, updatedItem, {safe: true}, function (err, result) {
                if (err) {
                    console.log('Error during updating: ' + err);
                    failure();
                } else {
                    console.log('' + result + ' document(s) updated');
                    for (var i in filesToDelete) {
                        dbox.deleteFile(filesToDelete[i], function () {
                            //potentially should be sync
                        });
                    }
                    for (var i in newFiles) {
                        dbox.addFile(newFiles[i], newFiles[i].imageName, function () {
                            //potentially should be sync
                        });
                    }
                    successful(result[0]);
                }
            });
        });
    };
    db.collection(collectionName, function (err, collection) {
        collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, oldItem) {
            var imagesToDelete = findImagesToDelete(oldItem, item);
            updateProcess(item, imagesToDelete, files);
        });
    });

}

function findImagesToDelete(originalObject, newObject) {
    var imagesToDelete = [];
    for (var i in originalObject.images) {
        if (newObject.images.indexOf(originalObject.images[i]) === -1) {
            imagesToDelete.push(originalObject.images[i])
        }
    }
    return imagesToDelete;
}

exports.deleteItem = function (req, res) {
    var id = req.params.id;
    db.collection(collectionName, function (err, collection) {
        collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, item) {
            for (var key in item.images) {
                dbox.deleteFile(item.images[key], function () {
                });
            }
            db.collection(collectionName, function (err, collection) {
                collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function (err, result) {
                    if (err) {
                        res.send({'error': 'An error has occurred - ' + err});
                    } else {
                        console.log('' + result + ' document(s) deleted');
                        res.send(req.body);
                    }
                });
            });

        });
    });

};