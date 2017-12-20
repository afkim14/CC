/*

  SKETCH.JS : HANDLES SERVER-CLIENT INTERACTION FOR GAME

*/

function sendGameRequest() {
  // TODO: add interaction with server to ask if it is valid to start a gameHTML
  socket.emit('request new game', currentRoom.id);
}

socket.on('respond new game', function(data) {
  if (data.playercolors) {
    switchToState(4); // State.Game
    if (currentRoom.type == "CHINESE CHECKERS") {
      Color = data.allcolors;
      startCCGame(data.allcolors, data.playercolors);
    }
  } else {
    document.getElementById("reply").innerHTML = data.error;
  }
});

socket.on('piece moved', function(response) {
  console.log("piece moved response");
  board.spots[response.piecePosition.x][response.piecePosition.y].moveBoardPiece(response.newPosition);
  board.setClickability();
});
