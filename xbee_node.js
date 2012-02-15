/*/ Initialize servers  /*/
var express = require("express"),
    io = require("socket.io");

/*/ Start Servers /*/
var app = express.createServer(),
    io = io.listen(app);

app.listen(process.env.PORT || 8000);

/*/ Set server of files /*/
app.setAppFile = (function () {
   app.get('/', function (req, res) {
     res.sendfile(__dirname + '/WWW/index.html');
   });
   app.get('/index.html', function (req, res) {
     res.sendfile(__dirname + '/WWW/index.html');
   });
   app.get('/jade.html', function (req, res) {
      res.sendfile(__dirname + '/WWW/jade.html');
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

/*/ Make server respond to queries /*/
io.sockets.on('connection', function (socket) {
   socket.on('msg', function (msg) {
      if (msg) {
         try {
            socket.broadcast.emit('msg', JSON.parse(msg));
         }
         catch (err) {
            console.error(err);
         }
      }
   });
   socket.on('command', function (command) {
      socket.broadcast.emit('command', command);
   });
   socket.on('SampleRate', function (sample) {
      socket.broadcast.emit('SampleRate', sample);
   });
});

/*/ Settings of Socket.io /*/
io.set('transports', ['xhr-polling']);
io.set("polling duration", 10);
