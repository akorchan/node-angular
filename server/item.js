var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var databaseName = 'heroku_app18084336';
var collectionName = 'items';

var server = new Server('ds043368.mongolab.com', 43368, {auto_reconnect: true});
db = new Db(databaseName, server);

db.open(function (err, db) {
    //authentication process
    db.authenticate('buona', 'buona', function (err, result) {
        if (!result) {
            db.close();
        }
    });
    if (!err) {
        console.log("Connected to '" + databaseName + "' database");
        db.collection(collectionName, {strict: true}, function (err, collection) {
            if (err) {
                console.log("The '" + collectionName + "' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.getAllItems = function (req, res) {
    db.collection(collectionName, function (err, collection) {
        collection.find().toArray(function (err, items) {
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

exports.addItem = function (req, res) {
    var item = req.body;
    console.log('Adding item: ' + JSON.stringify(item));
    db.collection(collectionName, function (err, collection) {
        collection.insert(item, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateItem = function (req, res) {
    var id = req.params.id;
    var item = req.body;
    console.log('Updating item: ' + id);
    console.log(JSON.stringify(item));
    db.collection(collectionName, function (err, collection) {
        collection.update({'_id': new BSON.ObjectID(id)}, item, {safe: true}, function (err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(item);
            }
        });
    });
};

exports.deleteItem = function (req, res) {
    var id = req.params.id;
    console.log('Deleting item: ' + id);
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
        },
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
        },
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
        },
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