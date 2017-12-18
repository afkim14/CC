// NEED: Color, BoardLocation, BoardPiece, constrainedCanvasWidth, constrainedCanvasHeight

class Board {
  constructor(playercolors) {
    this.spots = []; // [][] of BoardLocations
    this.playercolors = playercolors;
    this.numOfPlayers = Object.keys(playercolors).length;
    this.boardHeight = 21;
    this.boardWidth = 17;
    this.createBoard();
    this.drawBoard();
  }

  createBoard() {
    // board can be seen as a 13x17 grid
    var tempBoard = [];
    var actualRowWidths = [
      1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1
    ];
    var rowOffsets = [
      6, 5, 5, 4, 0, 0, 1, 1, 2, 1, 1, 0, 0, 4, 5, 5, 6
    ];
    var currRowWidth;
    var actualHeight = 17;
    var actualWidth = 13;
    var currPlayerColorIndex = 0;
    var colorCounts = [0, 0, 0, 0, 0, 0];
    for (var i = 0; i < actualHeight; i++) {
      currRowWidth = actualRowWidths[i];
      tempBoard[i] = []
      var rowOffsetY = rowOffsets[i];
      for (var j = 0; j < actualWidth; j++) {
        if (j >= rowOffsetY && j < rowOffsetY + currRowWidth) {
          tempBoard[i][j] = new BoardLocation(i+2, j+2);
          if (i < 4) {
            if (this.numOfPlayers != 4) {
              if (colorCounts[0] < 10) {
                tempBoard[i][j].homeColor = Color[this.playercolors[Object.keys(this.playercolors)[currPlayerColorIndex]]];
                tempBoard[i][j].boardPiece = new BoardPiece(i+2, j+2, Color[this.playercolors[Object.keys(this.playercolors)[currPlayerColorIndex]]]);
                colorCounts[0]++;
                if (colorCounts[0] == 10) { currPlayerColorIndex++; }
              }
            } else {
              tempBoard[i][j].homeColor = Color.CLOSED;
            }
          } else if (i < 8) {
            if ((i == 4 && j < 4) || (i == 5 && j < 3) || (i == 6 && j < 3) || (i == 7 && j < 2)) {
              if (this.numOfPlayers == 4 || this.numOfPlayers == 6) {
                if (colorCounts[1] < 10) {
                  tempBoard[i][j].homeColor = Color[this.playercolors[Object.keys(this.playercolors)[currPlayerColorIndex]]];
                  tempBoard[i][j].boardPiece = new BoardPiece(i+2, j+2, Color[this.playercolors[Object.keys(this.playercolors)[currPlayerColorIndex]]]);
                  colorCounts[1]++;
                  if (colorCounts[1] == 10) { currPlayerColorIndex++; }
                }
              } else {
                tempBoard[i][j].homeColor = Color.CLOSED;
              }
            } else if ((i == 4 && j > 8) || (i == 5 && j > 8) || (i == 6 && j > 9) || (i == 7 && j > 9)) {
              if (this.numOfPlayers == 4 || this.numOfPlayers == 6) {
                if (colorCounts[2] < 10) {
                  tempBoard[i][j].homeColor = Color[this.playercolors[Object.keys(this.playercolors)[currPlayerColorIndex]]];
                  tempBoard[i][j].boardPiece = new BoardPiece(i+2, j+2, Color[this.playercolors[Object.keys(this.playercolors)[currPlayerColorIndex]]]);
                  colorCounts[2]++;
                  if (colorCounts[2] == 10) { currPlayerColorIndex++; }
                }
              } else {
                tempBoard[i][j].homeColor = Color.CLOSED;
              }
            } else {
              tempBoard[i][j].homeColor = Color.EMPTY;
            }
          } else if (i < 13) {
            if ((i == 9 && j < 2) || (i == 10 && j < 3) || (i == 11 && j < 3) || (i == 12 && j < 4)) {
              if (this.numOfPlayers != 2) {
                if (colorCounts[3] < 10) {
                  tempBoard[i][j].homeColor = Color[this.playercolors[Object.keys(this.playercolors)[currPlayerColorIndex]]];
                  tempBoard[i][j].boardPiece = new BoardPiece(i+2, j+2, Color[this.playercolors[Object.keys(this.playercolors)[currPlayerColorIndex]]]);
                  colorCounts[3]++;
                  if (colorCounts[3] == 10) { currPlayerColorIndex++; }
                }
              } else {
                tempBoard[i][j].homeColor = Color.CLOSED;
              }
            } else if ((i == 9 && j > 9) || (i == 10 && j > 9) || (i == 11 && j > 8) || (i == 12 && j > 8)) {
              if (this.numOfPlayers != 2) {
                if (colorCounts[4] < 10) {
                  tempBoard[i][j].homeColor = Color[this.playercolors[Object.keys(this.playercolors)[currPlayerColorIndex]]];
                  tempBoard[i][j].boardPiece = new BoardPiece(i+2, j+2, Color[this.playercolors[Object.keys(this.playercolors)[currPlayerColorIndex]]]);
                  colorCounts[4]++;
                  if (colorCounts[4] == 10) { currPlayerColorIndex++; }
                }
              } else {
                tempBoard[i][j].homeColor = Color.CLOSED;
              }
            } else {
              tempBoard[i][j].homeColor = Color.EMPTY;
            }
          } else {
            if (this.numOfPlayers == 2 || this.numOfPlayers == 6) {
              if (colorCounts[5] < 10) {
                tempBoard[i][j].homeColor = Color[this.playercolors[Object.keys(this.playercolors)[currPlayerColorIndex]]];
                tempBoard[i][j].boardPiece = new BoardPiece(i+2, j+2, Color[this.playercolors[Object.keys(this.playercolors)[currPlayerColorIndex]]]);
                colorCounts[5]++;
                if (colorCounts[5] == 10) { currPlayerColorIndex++; }
              }
            } else {
              tempBoard[i][j].homeColor = Color.CLOSED;
            }
          }
        } else {
          tempBoard[i][j] = null;
        }
      }
    }

    // add border
    for (var i = 0; i < this.boardHeight; i++) {
      this.spots[i] = [];
      for (var j = 0; j < this.boardWidth; j++) {
        if (j < 2 || i < 2 || i > 18 || j > 14) {
          this.spots[i][j] = null;
        } else {
          this.spots[i][j] = tempBoard[i-2][j-2];
        }
      }
    }

    console.log(this.spots);
  }

  drawBoard() {
    var offsetX = 55; // can't put in array because its mutating
    var offsetY = 44;
    var startingPosX = constrainedCanvasWidth/2 - 20;
    var startingPosY = 30;
    var currentOffset = [startingPosX, startingPosY];
    var gridOffsets = [
      0, offsetX/2, (offsetX/2) * 2, (offsetX/2) * 3,
      (offsetX/2) * 12, (offsetX/2) * 11, (offsetX/2) * 10, (offsetX/2) * 9,
      (offsetX/2) * 8,
      (offsetX/2) * 9, (offsetX/2) * 10, (offsetX/2) * 11, (offsetX/2) * 12,
      (offsetX/2) * 3, (offsetX/2) * 2, (offsetX/2), 0,
    ];

    // draw the board pieces
    for (var i = 0; i < this.boardHeight-4; i++) {
      currentOffset[0] = startingPosX - gridOffsets[i];
      for (var j = 0; j < this.boardWidth-4; j++) {
        var indexOffsetX = i+2;
        var indexOffsetY = j+2;
        if (this.spots[indexOffsetX][indexOffsetY] != null) {
          // Have to offset the buttons based on the position of the canvas
          var newButton = p5js.createButton('');
          newButton.parent('gameButtons');
          newButton.id("piece");
          newButton.position(currentOffset[0], currentOffset[1]);
          changeButtonPosition(newButton, canvas.position().x, canvas.position().y);
          this.spots[indexOffsetX][indexOffsetY].button = newButton;
          this.spots[indexOffsetX][indexOffsetY].setColor();
          currentOffset[0] += offsetX;
        }
      }
      currentOffset[1] +=offsetY;
    }

    this.setClickability();
  }

  setClickability() { // adds listeners to clickable buttons (player's pieces)
    for (var i = 0; i < this.boardHeight; i++) {
      for (var j = 0; j < this.boardWidth; j++) {
        if (this.spots[i][j]) {
          if (this.spots[i][j].boardPiece) {
            if (this.spots[i][j].boardPiece.color == player.color) {
              this.spots[i][j].button.mousePressed(this.spots[i][j].spotSelected.bind(this, {x: i, y: j}));
            } else {
              this.spots[i][j].button.mousePressed(false);
            }
          }
        }
      }
    }
  }
}
