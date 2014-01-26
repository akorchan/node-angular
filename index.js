//for heroku
var express = require('express');
var http = require('http');
var item = require('./server/item');
var dbox = require('./server/dbox');
var auth = require('./server/auth');

var app = express();
app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'secret'}));
    app.use(express.errorHandler());
    app.use(express.favicon(__dirname + '/public/images/logo.png'));
    app.use('/public', express.static(__dirname + '/public'));
});

app.get('/', /*auth.checkAuth,*/ function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

//app.get('/login', function (req, res) {
//    res.sendfile(__dirname + '/public/login.html');
//});


app.post('/user/login', auth.login);
app.post('/user/logout', auth.logout);
app.get('/items', item.getAllItemsByType);
app.get('/items/:id', item.findItemById);
app.post('/items', auth.checkAuth, item.addOrUpdateItem);
//app.put('/items/:id', auth.checkAuth, item.updateItem);
app.delete('/items/:id', /*auth.checkAuth,*/ item.deleteItem);
app.get('/images/:path', dbox.getFile);

var port = process.env.PORT || 5000;
http.createServer(app).listen(port);
console.log("server listening on port " + port);