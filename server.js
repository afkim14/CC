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

io.on('connection', function(socket) {
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
      rooms[newRoom.id] = newRoom;
      socket.emit('room response', {room: newRoom});
    } else {
      socket.emit('room response', {room: null,
                                    error: "Failed to create room. Make sure title is less than 10 characters"});
    }
  });

  socket.on('get rooms', function() {
    socket.emit('get room response', {rooms: rooms});
  });

  socket.on('enter room', function(roomid) {
    if (rooms[roomid]) {
      rooms[roomid].players[socket.id] = users[socket.id];
      socket.emit('room response', {room: rooms[roomid]});
    } else {
      socket.emit('room response', {room: null,
                                    error: "Failed to join room."});
    }
  });

  socket.on('open room connection', function(roomid) {
    socket.join(roomid);
    io.to(roomid).emit('room update', {room: rooms[roomid]});
  });

  socket.on('quit room', function(roomid) {
    if (rooms[roomid]) {
      delete rooms[roomid].players[socket.id];
      socket.leave(roomid);
      io.to(roomid).emit('room update', {room: rooms[roomid]});

      // If no one else left in the room
      if (Object.keys(rooms[roomid].players).length <= 0) {
        delete rooms[roomid];
      }
    }
  });

  socket.on('room message', function(data) {
    var roomId = data.roomId;
    // data.message is hardcoded right now
    io.sockets.in(data.roomId).emit('room message', data.message);

    // this holds info about all sockets connected to the room
    var roster = io.sockets.adapter.rooms[data.roomId];
  });

  socket.on('disconnect', function() {
    // TODO: remove player if he/she's in a room
    if (socket.id in users) {
      delete users[socket.id];
    }
  });
});


http.listen(port, function(){
  console.log('listening on *:' + port);
});
