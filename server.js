var setup = require('./server/setup');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var users = {};
var rooms = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('new user', function(username) {
    var newUser = setup.createUser(username, socket.id);
    users[socket.id] = newUser;
    //console.log("new user: " + users[socket.id]);
  });

  socket.on('new room', function(roomTitle) {
    var newRoom = setup.createRoom(roomTitle, users[socket.id]);
    rooms.push(newRoom);
    console.log(rooms);
  });

  // TODO: Fix
  socket.on('disconnect', function() {
    console.log(socket.id + " has left the server.");
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
