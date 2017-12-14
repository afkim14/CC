/*

  SETUP.JS : HANDLES SERVER-CLIENT INTERACTION FOR CREATING USERNAMES, ROOMS, JOINING/QUITING ROOMS.

*/

function sendUsernameToServer() {
  socket.emit('new user', $('#username').val());
  return;
};

function createRoom() {
  socket.emit('new room', $('#roomTitle').val());
  return;
}

function enterRoom(roomid) {
  socket.emit('enter room', roomid);
  return;
}

function quitRoom() {
  socket.emit('quit room', currentRoom.id);
  switchToState(State.MAIN);
  return;
}

function getRooms() {
  socket.emit('get rooms');
  return;
}

function joinServerRoomOnResponse() {
  socket.emit('open room connection', currentRoom.id);
}

/*
function sendMessage() {
  var message = { // make this an enum later
    roomId: currentRoom.title,
    message: "hello room"
  }
  socket.emit('room message', message);
}*/

socket.on('room message', function(data){
  // prints message from server onto console
  console.log(data);
});

socket.on('get room response', function(data) {
  rooms = data.rooms;
  state = State.MAIN;
  toggleView();
});

socket.on('login response', function(data) {
  if (data.user != null) {
    currentUser = data.user;
    var roomsSocket = io('/rooms');
    switchToState(State.MAIN);
  } else {
    document.getElementById("reply").innerHTML = data.error;
  }
});

socket.on('room response', function(data) {
  if (data.room) {
    currentRoom = data.room;
    joinServerRoomOnResponse();
    switchToState(State.LOBBY);
  } else {
    document.getElementById("reply").innerHTML = data.error;
  }
});

socket.on('room update', function(data) {
  currentRoom = data.room;
  switchToState(State.LOBBY);
});
