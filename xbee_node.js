var express = require("express"),
    io = require("socket.io");

var app = express.createServer()
  , io = io.listen(app);

console.log("Created");

//http://www.laptop.lan:8000/
//http://stackoverflow.com/questions/6692908/formatting-messages-to-send-to-socket-io-node-js-server-from-python-client
//http://www.laptop.lan:8080/websocket_test.html#
//https://github.com/LearnBoost/socket.io-spec

var port = process.env.PORT || 8000;

console.log("port:" port);

app.listen(port);

app.setAppFile = (function () {
   app.get('/', function (req, res) {
      res.sendfile(__dirname + '/WWW/jade.html');
   });
   app.get('/index.html', function (req, res) {
     res.sendfile(__dirname + '/WWW/index.html');
   });
   app.get('/h5utils.js', function (req, res) {
      res.sendfile(__dirname + '/WWW/h5utils.js');
   });
   app.get('/interface.css', function (req, res) {
      res.sendfile(__dirname + '/WWW/interface.css');
   });
   app.get('/debug.js', function (req, res) {
      res.sendfile(__dirname + '/WWW/debug.js');
   });
   app.get('/event.js', function (req, res) {
      res.sendfile(__dirname + '/WWW/event.js');
   });
   app.get('/jquery-1.7.1.min.js', function (req, res) {
      res.sendfile(__dirname + '/WWW/jquery-1.7.1.min.js');
   });
})();

io.sockets.on('connection', function (socket) {
   socket.on('msg', function (msg) {
      if (msg)
         socket.broadcast.emit('msg', JSON.parse(msg));
   });
   socket.on('command', function (command) {
      socket.broadcast.emit('msg', command);
   });
});

io.set('transports', [                     // enable all transports (optional if you want flashsocket)
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);
