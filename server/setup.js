const User = require('../client/user.js');

module.exports = {
  createUser: function (username, socketid) {
    var newUser = new User(username, socketid);
    return newUser;
  },
  removeUser: function () {
    // whatever
  },
  createRoom: function () {
    // whatever
  },
  addUserToRoom: function () {
    // whatever
  },
  removeUserFromRoom: function () {
    // whatever
  },
};
