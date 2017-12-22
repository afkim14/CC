var gameRooms = {};
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
  socket.on('request start turn', function(data) {
    gameRooms[data.room.id] = data.room;
    var turnResponse = {
      color: allColors[data.room.turnIndex]
    }
    io.sockets.connected[data.room.players[Object.keys(data.room.players)[data.room.turnIndex]].socketid].emit("your turn", turnResponse);
  });

  socket.on('move piece', function(data) {
  	var response = {
  		newPosition: data.position,
  		piecePosition: data.boardLocation
  	}
  	io.to(data.roomId).emit('piece moved', response);
  });

  socket.on('end turn', function(data) {
    var room = gameRooms[data.roomId];
    room.turnIndex = (room.turnIndex + 1) % Object.keys(room.players).length;
    var turnResponse = {
      color: allColors[room.turnIndex]
    }
    io.sockets.connected[room.players[Object.keys(room.players)[room.turnIndex]].socketid].emit("your turn", turnResponse);
  });
}
