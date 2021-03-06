class BoardLocation {
  constructor(row, col) {
    this.position = {x: row, y: col};
    this.boardPiece = null;
    this.homeColor = null;
    this.button = null;
  }

  setColor() {
    this.color = this.boardPiece ? this.boardPiece.color : Color.EMPTY;
    if (this.boardPiece) {
      this.button.style("background-color", this.boardPiece.color);
      this.button.style("border-color", this.boardPiece.color);
    } else {
      this.button.style("background-color", Color.EMPTY);
      this.button.style("border-color", Color.EMPTY);
    }
  }

  setClickedColor(clicked) {
    clicked ? this.button.style("background-color", Color.EMPTY) : this.button.style("background-color", player.color);
  }

  spotSelected(pos) { // CANNOT USE (THIS) INSIDE BECAUSE IT IS ATTATCHED TO A BUTTON OUTSIDE OF CLASS
    if (player.currSelectedSpot) {
      player.resetCurrPieceAndNeighbors();
    }
    // new current selected piece
    player.currSelectedSpot = board.spots[pos.x][pos.y];
    player.currSelectedSpot.setClickedColor(player.turn);
    // activate all possible neigbhors only on player's turn
    if (player.turn) {
      player.currNeighbors = player.currSelectedSpot.getValidNeighbors(0, null);
      player.currSelectedSpot.showNeighborPieces(player.currNeighbors);
    } else {
      if (!player.turn) player.currSelectedSpot = null;
    }
  }

  destinationSpotSelected(pos) { // CANNOT USE THIS INSIDE BECAUSE IT IS ATTATCHED TO A BUTTON OUTSIDE OF CLASS
    if (player.turn) {
      player.currSelectedSpot.sendMovePieceServerRequest(pos);
      player.resetCurrPieceAndNeighbors();
    }
  }

  getValidNeighbors(depth, origin) {
    var neighbors = [];
    var neighborPositions;
    if (this.position.x % 2  == 0) { // even row
      var neighborPositions =         [ {x: this.position.x, y: this.position.y-1},
                                        {x: this.position.x, y: this.position.y+1},
                                        {x: this.position.x-1, y: this.position.y-1},
                                        {x: this.position.x-1, y: this.position.y},
                                        {x: this.position.x+1, y: this.position.y-1},
                                        {x: this.position.x+1, y: this.position.y},
                                      ];
      var furtherNeighborPositions =  [ {x: this.position.x, y: this.position.y-2},
                                        {x: this.position.x, y: this.position.y+2},
                                        {x: this.position.x-2, y: this.position.y-1},
                                        {x: this.position.x-2, y: this.position.y+1},
                                        {x: this.position.x+2, y: this.position.y-1},
                                        {x: this.position.x+2, y: this.position.y+1}
                                      ];
    } else {                     // odd row
      var neighborPositions =         [ {x: this.position.x, y: this.position.y-1},
                                        {x: this.position.x, y: this.position.y+1},
                                        {x: this.position.x-1, y: this.position.y+1},
                                        {x: this.position.x-1, y: this.position.y},
                                        {x: this.position.x+1, y: this.position.y+1},
                                        {x: this.position.x+1, y: this.position.y},
                                      ];
      var furtherNeighborPositions =  [ {x: this.position.x, y: this.position.y-2},
                                        {x: this.position.x, y: this.position.y+2},
                                        {x: this.position.x-2, y: this.position.y+1},
                                        {x: this.position.x-2, y: this.position.y-1},
                                        {x: this.position.x+2, y: this.position.y+1},
                                        {x: this.position.x+2, y: this.position.y-1}
                                      ];
    }

    var validFurtherNeighbors = [];
    for (var i = 0; i < neighborPositions.length; i++) {
      var loc = board.spots[neighborPositions[i].x][neighborPositions[i].y];
      if (loc) {
        if (loc.boardPiece) {
          var furtherLoc = board.spots[furtherNeighborPositions[i].x][furtherNeighborPositions[i].y];
          if (furtherLoc) {
            if (furtherLoc != origin && furtherLoc.boardPiece == null) {
              furtherLoc.button.mousePressed(this.destinationSpotSelected.bind(this, {x: furtherNeighborPositions[i].x, y: furtherNeighborPositions[i].y}));
              validFurtherNeighbors.push(furtherLoc);
              neighbors.push(furtherLoc);
            }
          }
        } else {
          if (depth == 0) { // only want to add adjacent neighbors for first layer
            loc.button.mousePressed(this.destinationSpotSelected.bind(this, {x: neighborPositions[i].x, y: neighborPositions[i].y}));
            neighbors.push(loc);
          }
        }
      }
    }

    for (var j = 0; j < validFurtherNeighbors.length; j++) {
      neighbors = neighbors.concat(validFurtherNeighbors[j].getValidNeighbors(depth+1, this));
    }

    return neighbors;
  }

  showNeighborPieces(neighbors) {
    for (var i = 0; i < neighbors.length; i++) {
      neighbors[i].button.style("background-color", player.color);
      neighbors[i].button.style("border-color", "#000000");
    }
  }

  sendMovePieceServerRequest(newPos) {
    // I think node puts this class inside index.html? So we can use currentroom and socket here, but should probs change later.
    var moveData = {
      roomId: currentRoom.id,
      position: newPos,
      boardLocation: this.position
    }
    socket.emit('move piece', moveData);
  }

  moveBoardPiece(newPos) {
    board.spots[newPos.x][newPos.y].boardPiece = this.boardPiece;
    board.spots[newPos.x][newPos.y].setColor();
    this.boardPiece = null;
    this.setColor();
    var endTurnRequest = {
      roomId: currentRoom.id,
      color: board.spots[newPos.x][newPos.y].boardPiece.color
    }
    if (board.spots[newPos.x][newPos.y].boardPiece.color == player.color) {
      player.turn = false;
      socket.emit('end turn', endTurnRequest);
    }
  }
}
