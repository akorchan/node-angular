'use strict';

var mongo = require('mongodb');
var fs = require('fs');
var path = require('path');
var dbox = require('./dbox');

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
//        db.collection(collectionName, {strict: true}, function (err, collection) {
//            if (err) {
//                console.log("The '" + collectionName + "' collection doesn't exist. Creating it with sample data...");
//                populateDB();
//            }
//        });
    }
});

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
    var file = files[0]; //temporary
    if (item._id) {
        updateItem(item, file,
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
//                    var imagesArray = [];
                        for (var i in files) {
//                        var image = {};
                            var imageIndex = i === "file0" ? "" : "_" + i.substring(4);
                            files[i].name = encode_utf8(result[0]._id) + imageIndex + ".jpg";
//                        image.file = files[i];
                            result[0]["image" + imageIndex] = files[i];
//                        imagesArray.push(image);
                        }
                        if (typeof  result[0].image === "undefined") {
                            result[0].image = "placeholder.jpg";
                        }
                        collection.update({'_id': new BSON.ObjectID(encode_utf8(result[0]._id))}, result[0], {safe: true}, function (err, result) {
                                if (err) {
                                    console.log('Error updating item: ' + err);
                                    failure();
                                } else {
                                    console.log('' + result + ' document(s) updated');
                                    //in case of local storage
//                                saveFileToStore(file, item.image, function () {
//                                    res.send(result[0]);
//                                });
                                    for (var key in item) {
                                        if ((key.indexOf("image") == 0) && (item.hasOwnProperty(key))) {
                                            var findInFiles = function () {
                                                for (var i in files)
                                                    if (files[i].name == item[key].name)
                                                        return files[i];
                                                return null;
                                            }
                                            var image = findInFiles();
                                            if (image) {
                                                dbox.addFile(image, image.name, function () {
                                                    successful(result[0]);
                                                });
                                            }
                                        }
                                    }
                                }
//
//                                for (var i in imagesArray) {
//
//                                }

                            }
                        );
                    }
                }
            );
        }
    );
}

function updateItem(item, file, successful, failure) {
    var id = item._id;
    delete item._id;
    console.log('Updating item: ' + id);
    console.log(JSON.stringify(item));
    db.collection(collectionName, function (err, collection) {
        item.image = file ? encode_utf8(id) + ".jpg" : item.image;
        collection.update({'_id': new BSON.ObjectID(id)}, item, {safe: true}, function (err, result) {
            if (err) {
                console.log('Error during updating: ' + err);
                failure();
            } else {
                console.log('' + result + ' document(s) updated');
                if (file) {
                    dbox.deleteFile(id + ".jpg", function () {
                        dbox.addFile(file, item.image, function () {
                            successful(result[0]);
                        });
                    });
                } else {
                    successful(result[0]);
                }
            }
        });
    });
}

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

// in case of local storage
function saveFileToStore(fileToSave, fileName, callback) {
    if (fileToSave) {
        fs.readFile(fileToSave.path, function (err, data) {
            var newPath = './public/items-images/' + fileName;
            fs.writeFile(newPath, data, function (err) {
                if (err) {
                    console.log("error during file saving");
                } else {
                    callback();
                }
            });
        });
    } else {
        callback();
    }
}

exports.deleteItem = function (req, res) {
    var id = req.params.id;
//    var filePath = "./public/items-images/" + id + ".jpg";
    var removeFromDB = function () {
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
    };
    dbox.deleteFile(id + ".jpg", removeFromDB);
//    if (!path.existsSync(filePath)) {
//        removeFromDB();
//    } else {
//        fs.unlink(filePath, function (err) {
//            if (err)
//                throw err;
//            removeFromDB();
//        });
//    }


};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function () {

    var items = [
        {
            name: "Тунец в собственном соку Mareblu Weight Watchers tonno al naturale",
            code: "02-03-006",
            description: "Тунец в собственном соку, жир-0,6%. Идеален для тех, кто любит легкие продукты и хочет остаться в форме, не пропускайте хорошего вкуса за едой. Без консервантов.",
            price: "22",
            image: "1.jpg"
        },
        {
            name: "Тунец RIO MARE в оливковом масле Tonno all`olio di Oliva",
            code: "07-01-006",
            description: "Тунец в оливковом масле.Тонкий аромат тунца и оливкового масла. Не содержит консервантов или искусственных приправ. Здоровая, и полезная еда, богатая фосфористыми, легко усваемыми белками и ненасыщенными жирными кислотами (которые помогают бороться с холестерином).",
            price: "22",
            image: "2.jpg"
        },
        {
            name: "Каперсы Coelsanus Zero-aceto capperi",
            code: "09-03-016",
            description: "Каперсы  без уксуса. Каперсы могут быть использованными на кухне для приготовлении пиццы, как приправа для первых блюд, для мяса и рыбы, а также разнообразных соусов.",
            price: "45",
            image: "3.jpg"
        },
        {
            name: "Артишоки в рассолое Sacla",
            code: "09-03-003",
            description: "За 60 лет SACLÀ заслуженно заработала репутацию лидера в производстве итальянских традиционных продуктов питания премиум класса. Артишоки  Sacla Sottoli в оливковом рассоле с натуральными травами. Прекрасное дополнение к разнообразным блюдам Итальянской кухни.  На Сицилии утверждают, что регулярное употребление артишоков омолаживает. А еще артишоки эффективно выводят лишний холестерин из печени и снимают отечность.",
            price: "69",
            image: "4.jpg"
        },
        {
            name: "Перец фаршированный тунцом",
            code: "09-03-008",
            description: "Если возникла необходимость купить в Украине деликатес высокого качества, то совершенно правильным выбором является  Перец фаршированный тунцом. Изысканное сочетание ингредиентов придется по вкусу самым искушенным гурманам,  которых трудно чем-либо удивить. Гамма вкуса уникальна, она позволит вам оказаться в удивительной стране, проникнуться атмосферой роскоши и непринужденности. Данный деликатесный продукт доказывает своим существованием, что кулинария – это настоящее искусство и праздник не только для желудка, но и для души.",
            price: "55",
            image: "5.jpg"
        },
        {
            name: "Салат с тунцом INSALATONNO Mais e Piselli",
            code: "09-01-011",
            description: "",
            price: "49",
            image: "6.jpg"
        }
    ];

    db.collection(collectionName, function (err, collection) {
        collection.insert(items, {safe: true}, function (err, result) {
        });
    });

};
