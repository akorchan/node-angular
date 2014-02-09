'use strict';

var fs = require('fs');
//var dropbox = require("dbox").app({"app_key": process.env['dbox_app_key'], "app_secret": process.env['dbox_app_secret'] });
//var client = dropbox.createClient({oauth_token_secret: process.env['dbox_oauth_token_secret'], oauth_token: process.env['dbox_oauth_token'], uid: process.env['dbox_uid']});
var dropbox = require("dbox").app({"app_key": "sts4a829ak9ko4u", "app_secret": "a1hifhuhny8pn1p" });
var client = dropbox.createClient({oauth_token_secret: "p67e8tuhfgv5ors", oauth_token: "vz0msvup7v1p5mf4", uid: "174525281"});

exports.addFile = function (file, requiredName, callback) {
    if (file) {
        fs.readFile(file.path, function (err, data) {
            if (err) {
                console.log("Error during uploading image to Dropbox");
            }
            client.put(requiredName, data, function (status, reply) {
                callback();
            });
        });
    } else {
        console.log("Can't put file to Dropbox. File is not defined.");
        callback();
    }
};

exports.deleteFile = function (fileName, callback) {
    client.rm(fileName, function (e, data) {
        if ((e !== 200) && (e !== 404)) {
            console.log("Can't delete file.");
        }
        callback();
    });
};

exports.getFile = function (req, res) {
    var path = req.params.path;
    client.get(path, function (status, reply, metadata) {
        res.send(reply);
    });
};