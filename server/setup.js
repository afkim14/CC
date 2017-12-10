const User = require('../client/user.js');
const Room = require('../server/classes/room.js');

module.exports = {
  createUser: function (username, socketid) {
    var newUser = new User(username, socketid);
    return newUser;
  },
  removeUser: function () {
    // whatever
  },
  createRoom: function (roomName, owner) {
    var newRoom = new Room(roomName, owner);
    return newRoom;
  },
  addUserToRoom: function () {
    // whatever
  },
  removeUserFromRoom: function () {
    // whatever
  },
};
