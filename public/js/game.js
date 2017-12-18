/*

  SKETCH.JS : HANDLES SERVER-CLIENT INTERACTION FOR GAME

*/

function setupGame() {
  // TODO: add interaction with server to ask if it is valid to start a gameHTML
  socket.emit('request new game', currentRoom.id);

  switchToState(4); // State.GAME

  // if chinesecheckers
  startCCGame();
}
/*
socket.on('respond new game', data) {

}
*/
