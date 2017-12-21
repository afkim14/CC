var players = [];
var turnIndex = 0;
var numOfPlayers = 0;
var allColors = [
  "#EA5C6A", // RED
  "#6DC4E2", // BLUE
  "#92C570", // GREEN
  "#E3DC51", // YELLOW
  "#3F3F3F",  // BLACK
  "#FFFFFF", // WHITE
  "#787878", //EMPTY
  "#646464", // CLOSED
];

module.exports.listen = function(io, socket) {

  socket.on('request new game', function(data) {
    var roster = io.sockets.adapter.rooms[data];
    for (var socketId in roster.sockets) {
      var player = {
        socketId: socketId,
        color: allColors[numOfPlayers]
      }
      players.push(player);
      numOfPlayers++;
    }
    var turnResponse = {
      color: allColors[turnIndex]
    }
    io.sockets.connected[players[turnIndex].socketId].emit("your turn", turnResponse);
  });

  socket.on('move piece', function(data) {
  	var response = {
  		newPosition: data.position,
  		piecePosition: data.boardLocation
  	}
  	io.to(data.roomId).emit('piece moved', response);
  });

  socket.on('end turn', function(data) {
    turnIndex = (turnIndex + 1) % numOfPlayers;
    var turnResponse = {
      color: allColors[turnIndex]
    }
    io.sockets.connected[players[turnIndex].socketId].emit("your turn", turnResponse);
  });
}
