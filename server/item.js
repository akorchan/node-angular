'use strict';

var uuid = require('node-uuid');
var path = require('path');
var db = require('./db');
var dbox = require('./dbox');
var BSON = require('mongodb').BSONPure;
var config = require("./config");

var collectionName = 'items';

var coef = 1;

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

exports.getAllItemsByType = function (req, res) {
    config.getConfig(1000, function (config) {
        if (typeof config.coef !== 'undefined') {
            coef = config.coef;
        }
        var condition = {};
        var requestItemType = req.query.type;
        if (requestItemType !== "") {
            if (requestItemType !== "-1")
                condition = {type: req.query.type};
            else
                condition = {isSale: "1"};
        }

        var currency = req.query.currency;

        db.collection(collectionName, function (err, collection) {
            collection.find(condition).sort("date", -1,function () {
            }).limit(parseInt(req.query.number)).toArray(function (err, items) {
                    if (currency === "") {
                        res.send(updatePrice(items));
                    } else {
                        res.send(updatePriceBasedOnCoef(items));
                    }
                });
        });
    });

};

exports.findItemById = function (req, res) {
    config.getConfig(1000, function (config) {
        if (typeof config.coef !== 'undefined') {
            coef = config.coef;
        }
        var id = req.params.id;
        console.log('Retrieving item: ' + id);
        var currency = req.query.currency;
        module.exports.findItemByIdInternal(req.params.id, function (err, item) {
            if (currency === "usd") {
                res.send(updatePriceForSingleItem(item));
            } else {
                res.send(updatePriceForSingleItemCoef(item));
            }
        });
    });

};

function updatePriceBasedOnCoef(items) {
    for (var index = 0; index < items.length; ++index) {
        updatePriceForSingleItemCoef(items[index]);
    }
    return items;
}

function updatePriceForSingleItemCoef(item) {
    if (typeof item.price !== 'undefined') {
        if (typeof item.price == 'number') {
            item.price = Math.round(item.price * coef) + ".00";
        } else {
            item.price = Math.round(item.price.replace(/[^\d.]/g, '') * coef) + ".00";

        }
    }
    else {
        item.price = 0.00;
    }
    return item;
}


function updatePrice(items) {
    for (var index = 0; index < items.length; ++index) {
        updatePriceForSingleItem(items[index]);
    }
    return items;
}

function updatePriceForSingleItem(item) {
    if (typeof item.price !== 'undefined') {
        item.price = Math.round(item.price.replace(/[^\d.]/g, '') * 1) + ".00";
    }
    else {
        item.price = 0.00;
    }
    return item;
}

exports.findItemByIdInternal = function (id, callback) {
    db.collection(collectionName, function (err, collection) {
        collection.findOne({'_id': new BSON.ObjectID(id)}, callback);
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