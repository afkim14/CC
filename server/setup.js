/*
    SETUP.JS : SERVER HANDLING FOR USER LOGINS AND ROOM SETUPS
*/

var helpers = require('./helpers');
var users = {};
var rooms = {};

module.exports.listen = function(io, socket) {
  socket.on('new user', function(username) {
    if (username.length <= 10) { // placeholder condition for now
      var newUser = helpers.createUser(username, socket.id);
      users[socket.id] = newUser;
      socket.emit('login response', {user: newUser});
    } else {
      socket.emit('login response', {user: null,
                                     error: "Failed to login. Make sure username is less than 10 characters"});
    }
  });

  socket.on('new room', function(roomTitle) {
    if (roomTitle.length <= 10) {
      var newRoom = helpers.createRoom(roomTitle, users[socket.id]);
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
    // remove player if he or she is in a room
    for (var roomid in rooms) {
      if (socket.id in rooms[roomid].players) {
        delete rooms[roomid].players[socket.id];
        socket.leave(roomid);
        io.to(roomid).emit('room update', {room: rooms[roomid]});

        // If no one else left in the room
        if (Object.keys(rooms[roomid].players).length <= 0) {
          delete rooms[roomid];
        }
      }
    }
    if (socket.id in users) {
      delete users[socket.id];
    }
  });
};
