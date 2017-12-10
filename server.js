var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('new user', function(username) {
    //console.log(username);
    //console.log(socket.id);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
