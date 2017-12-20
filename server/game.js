module.exports.listen = function(io, socket) {
  socket.on('move piece', function(data) {
  	var response = {
  		newPosition: data.position,
  		piecePosition: data.boardLocation
  	}
  	console.log("move piece called");
  	console.log(data);
  	io.to(data.roomId).emit('piece moved', response);
  });
}
