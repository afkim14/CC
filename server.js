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
      socket.join(roomTitle);
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
      rooms[roomKey].players[socket.id] = users[socket.id];
      for (var socketid in rooms[roomKey].players) {
        io.to(socketid).emit('room update', {room: rooms[roomKey]});
      }
      socket.emit('room response', {room: rooms[roomKey]});
    } else {
      socket.emit('room response', {room: null,
                                    error: "Failed to join room."});
    }
  });

  socket.on('open room connection', function(roomTitle) {
    socket.join(roomTitle);
  });

  socket.on('quit room', function(data) {
    // TODO: remove player from the room
    // we should change key from socket id to a room id ****************!!!!
    var roomid = data.room.owner.socketid;
    if (rooms[roomid]) {
      // if owner, right now transfer ownership but it can be whatever
      if (rooms[roomid].owner.socketid == socket.id && Object.keys(rooms[roomid].players).length > 1) {
        for (var socketid in rooms[roomid].players) {
          if (socketid != socket.id) {
            rooms[socketid] = rooms[roomid];
            delete rooms[roomid];
            roomid = socketid;
            rooms[roomid].owner = users[socketid];
          }
        }
      }

      delete rooms[roomid].players[socket.id];
      for (var socketid in rooms[roomid].players) {
        io.to(socketid).emit('room update', {room: rooms[roomid]});
      }

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
    if (socket.id in users) {
      delete users[socket.id];
    }
  });
});


http.listen(port, function(){
  console.log('listening on *:' + port);
});
