const User = require('../client/user.js');
const Room = require('../server/classes/room.js');

module.exports = {
  createUser: function (username, socketid) {
    var newUser = new User(username, socketid);
    return newUser;
  },
  createRoom: function (roomName, owner, type) {
    var newRoom = new Room(roomName, owner, type);
    return newRoom;
  },
};
