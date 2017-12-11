var setup = require('./server/setup');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var users = {}; // key: socket id, val: user obj
var rooms = {}; // key: socket id, val: room obj

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/rooms', function(req, res){
  res.send(rooms)
})

app.use('/', express.static(__dirname + '/public'));

io.on('connection', function(socket){
  socket.on('new user', function(username) {
    if (username.length <= 10) { // placeholder condition for now
      var newUser = setup.createUser(username, socket.id);
      users[socket.id] = newUser;
      socket.emit('login response', {user: newUser});
    } else {
      socket.emit('login response', {user: null,
                                     error: "Failed to login. Make sure username is less than 10 characters"});
    }
  });

  socket.on('new room', function(roomTitle) {
    if (roomTitle.length <= 10) {
      var newRoom = setup.createRoom(roomTitle, users[socket.id]);
      rooms[socket.id] = newRoom;
      socket.emit('room response', {room: newRoom});
    } else {
      socket.emit('room response', {room: null,
                                    error: "Failed to create room. Make sure title is less than 10 characters"});
    }
  });

  socket.on('get rooms', function() {
    socket.emit('get room response', {rooms: rooms});
  });

  socket.on('enter room', function(roomKey) {
    if (rooms[roomKey]) {
      rooms[roomKey].players.push(users[socket.id]);
      for (var i = 0; i < rooms[roomKey].players.length; i++) {
        var player = rooms[roomKey].players[i];
        io.to(player.socketid).emit('new player in room', {room: rooms[roomKey]});
      }
      socket.emit('room response', {room: rooms[roomKey]});
    } else {
      socket.emit('room response', {room: null,
                                    error: "Failed to join room."});
    }
  });

  socket.on('quit room', function(res) {
    // TODO: remove player from the room
    // we should change key from socket id to a room id
  });

  socket.on('disconnect', function() {
    if (socket.id in users) {
      delete users[socket.id];
    }
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
