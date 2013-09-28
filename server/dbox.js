'use strict';

var fs = require('fs');
//var dropbox = require("dbox").app({"app_key": process.env['dbox_app_key'], "app_secret": process.env['dbox_app_secret'] });
//var client = dropbox.createClient({oauth_token_secret: process.env['dbox_oauth_token_secret'], oauth_token: process.env['dbox_oauth_token'], uid: process.env['dbox_uid']});

exports.addFile = function (file, requiredName, callback) {
    if (file) {
        fs.readFile(file.path, function (err, data) {
            if (err) {
                console.log("Error during uploading image to Dropbox");
                throw err;
            }
            client.put(requiredName, data, function (status, reply) {
                callback();
            });
        });
    } else {
        console.log("Can't put file to Dropbox. File is not defined.")
    }
};

exports.deleteFile = function (fileName, callback) {
    client.rm(fileName, function (e, data) {
        if (e !== 200) {
            console.log("Can't delete file.");
            throw e;
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