var express = require('express');
var http = require('http');
//var auth = require('./server/routes/auth');
//var book = require('./server/routes/book');

var app = express();
app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.errorHandler());
    app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
    app.use('/public', express.static(__dirname + '/public'));
});


app.get('/', /*auth.checkAuth,*/ function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

//app.get('/login', function (req, res) {
//    res.sendfile(__dirname + '/public/login.html');
//});


//app.post('/user/login', auth.login);
//app.post('/user/logout', auth.logout);
//app.get('/book', book.findAll);
//app.post('/book', book.add);

http.createServer(app).listen(3000);
console.log("server listening on port 3000");