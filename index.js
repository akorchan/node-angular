//for heroku
var express = require('express');
var http = require('http');
var uuid = require('node-uuid');
var item = require('./server/item');
var dbox = require('./server/dbox');
var auth = require('./server/auth');
var visitors = require('./server/visitors');
var geotools = require('geotools');

var app = express();
app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'secret'}));
    app.use(express.errorHandler());
    app.use(express.favicon(__dirname + '/public/images/logo.png'));
    app.use('/public', express.static(__dirname + '/public'));
    app.use(function (req, res, next) {
//        console.log(req.domain);
//        console.log(req);
        if (req.headers.host === "myitaly.com.ua") {
            var trackId = req.cookies['track_id'];
            if (typeof trackId === 'undefined') {
                trackId = uuid.v1();
                res.cookie('track_id', trackId);
            }
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            var geo = geotools.lookup(ip);
            visitors.putVisitorsInfo(trackId, ip, geo !== null ? geo.country : "Не удалось определить страну", geo !== null ? geo.region : -1);
        }
        next();
    });
});

app.get('/', /*auth.checkAuth,*/ function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.post('/user/login', auth.login);
app.post('/user/logout', auth.logout);
app.get('/items', item.getAllItemsByType);
app.get('/items/:id', item.findItemById);
app.post('/items', auth.checkAuth, item.addOrUpdateItem);
app.delete('/items/:id', auth.checkAuth, item.deleteItem);
app.get('/images/:path', dbox.getFile);
app.get('/visitors', auth.checkAuth, visitors.getUnauthorizedVisitors);

var port = process.env.PORT || 5000;
http.createServer(app).listen(port);
console.log("server listening on port " + port);