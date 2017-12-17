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

  setClickedColor() {
    this.button.style("background-color", Color.EMPTY);
  }

  spotSelected(pos) { // CANNOT USE (THIS) INSIDE BECAUSE IT IS ATTATCHED TO A BUTTON OUTSIDE OF CLASS
    if (player.currSelectedSpot) {
      player.resetCurrPieceAndNeighbors();
    }

    // new current selected piece
    player.currSelectedSpot = board.spots[pos.x][pos.y];
    player.currSelectedSpot.setClickedColor();
    // activate all possible neigbhors
    player.currNeighbors = player.currSelectedSpot.getValidNeighbors();
    player.currSelectedSpot.showNeighborPieces(player.currNeighbors);
  }

  destinationSpotSelected(pos) { // CANNOT USE THIS INSIDE BECAUSE IT IS ATTATCHED TO A BUTTON OUTSIDE OF CLASS
    // TODO: if valid
    player.currSelectedSpot.moveBoardPiece(pos);
    player.resetCurrPieceAndNeighbors();
    board.setClickability();
  }

  getValidNeighbors() {
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

    // add possible further distance neighbors if applicable
    var allNeighbors = neighborPositions.concat(); // so it doesn't mutate
    for (var i = 0; i < neighborPositions.length; i++) {
      var loc = board.spots[neighborPositions[i].x][neighborPositions[i].y];
      if (loc) {
        if (loc.boardPiece) {
          allNeighbors.push(furtherNeighborPositions[i]);
        }
      }
    }

    // filter
    for (var i = 0; i < allNeighbors.length; i++) {
      if (board.spots[allNeighbors[i].x][allNeighbors[i].y]) {
        if (board.spots[allNeighbors[i].x][allNeighbors[i].y].boardPiece == null) {
          board.spots[allNeighbors[i].x][allNeighbors[i].y].button.mousePressed(this.destinationSpotSelected.bind(this, {x: allNeighbors[i].x, y: allNeighbors[i].y}));
          neighbors.push(board.spots[allNeighbors[i].x][allNeighbors[i].y]);
        }
      }
    }

    return neighbors;
  }

  showNeighborPieces(neighbors) {
    for (var i = 0; i < neighbors.length; i++) {
      neighbors[i].button.style("background-color", player.color);
      neighbors[i].button.style("border-color", "#000000");
    }
  }

  moveBoardPiece(newPos) {
    board.spots[newPos.x][newPos.y].boardPiece = this.boardPiece;
    board.spots[newPos.x][newPos.y].setColor();
    this.boardPiece = null;
    this.setColor();
  }
}
