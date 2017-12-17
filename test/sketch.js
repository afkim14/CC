var canvas;
var originalCanvasPos;
var constrainedCanvasWidth = 800;
var constrainedCanvasHeight = 800;
var board; // [][]
var boardWidth = 17;
var boardHeight = 21;
var numOfPlayers = 2; // this will be sent by the server later (2, 3, 4, 6 implemented)
var Color = {
    RED : "#EA5C6A",
    BLUE : "#6DC4E2",
    GREEN : "#92C570",
    YELLOW: "#E3DC51",
    BLACK: "#3F3F3F",
    WHITE: "#FFFFFF",
    EMPTY: "#787878",
    CLOSED: "#646464",
}
var myColor = Color.RED; // this will also be sent by the server
var tempNeighborColors;
var currNeighbors;

class BoardPiece {
  constructor(row, col, team) {
    this.position = {x: row, y: col};
    this.selected = false;
    this.team = team;
  }

  getValidMoves(pos) {
    var validMoves = [];
    var neighborPositions = [];
    var neighbors = [];
    var rows = [0, 0, -1, -1, 1, 1];
    var cols = [-1, 1, -1, 0, -1, 0];

    for (var i=0; i<6; i++) {
      if (this.position.x % 2 == 0) {
        neighborPositions.push({x: pos.x + rows[i], y: pos.y + cols[i]});
      } else {
        neighborPositions.push({x: pos.x + rows[i], y: pos.y - cols[i]});
      }
    }

    var farRows = [0, 0, -2, -2, 2, 2];
    var farCols = [-2, 2, -1, 1, -1, 1];

    var allNeighbors = neighborPositions.concat();
    for (var i = 0; i < neighborPositions.length; i++) {
      if (board[neighborPositions[i].x][neighborPositions[i].y]) {
        if (board[neighborPositions[i].x][neighborPositions[i].y].boardPiece) {
          if (this.position.x % 2 == 0) {
            allNeighbors.push({x: pos.x + farRows[i], y: pos.y + farCols[i]});
          } else {
            allNeighbors.push({x: pos.x + farRows[i], y: pos.y - farCols[i]});
          }
        }  
      }
    }


    for (var i = 0; i < allNeighbors.length; i++) {
      if (board[allNeighbors[i].x][allNeighbors[i].y]) {
        if (board[allNeighbors[i].x][allNeighbors[i].y].color == Color.EMPTY) {
          board[allNeighbors[i].x][allNeighbors[i].y].button.mousePressed(destinationSpotSelected.bind(this, {x: allNeighbors[i].x, y: allNeighbors[i].y}));
          neighbors.push(board[allNeighbors[i].x][allNeighbors[i].y]);
        }
      }
    }
    console.log(neighbors);
    return neighbors;
  }

  movePiece(newPosition) {
    this.position = newPosition;
  }
}

class BoardLocation {
  constructor(row, col) {
    this.position = {x: row, y: col};
    this.boardPiece = null;
    this.color = null;
    this.button = null;
  }

  setColor() {
    this.color = this.boardPiece ? this.boardPiece.team : Color.EMPTY;
    this.setButtonColor();
  }

  setButtonColor() {
    if (this.button) {
      if (this.boardPiece) {
        this.button.style("background-color", this.boardPiece.team);
        this.button.style("border-color", this.boardPiece.team);
      } else {
        this.button.style("background-color", Color.EMPTY);
        this.button.style("border-color", Color.EMPTY);
      }
    }
  }
}

var currSelectedPiece = new BoardPiece(-1, -1, Color.CLOSED); // when user presses a piece

function setup() {
  canvas = createCanvas(constrainedCanvasWidth, constrainedCanvasHeight);
  canvas.parent('gameCanvasContainer');
  originalCanvasPos = canvas.position();
  background(100, 100, 100);
  createBoard();
  drawBoard();
}

function draw() {

}

function positionSelected(pos) {
  resetNeighbors();
  currSelectedPiece = board[pos.x][pos.y].boardPiece;
  currNeighbors = currSelectedPiece.getValidMoves(pos);
  showValidMoves(currNeighbors);
}

function showValidMoves(validMoves) {
  if (validMoves) {
    for (var i = 0; i < validMoves.length; i++) {
      validMoves[i].button.style("background-color", Color.YELLOW);
    }
  }
}

function destinationSpotSelected(pos) {
  // TODO: if valid
  // reset original position
  var prevPosition = currSelectedPiece.position;
  board[prevPosition.x][prevPosition.y].boardPiece = null;
  board[prevPosition.x][prevPosition.y].setColor();
  resetNeighbors();

  // move piece to new spot
  currSelectedPiece.movePiece(pos);
  board[pos.x][pos.y].button.mousePressed(false);
  board[pos.x][pos.y].boardPiece = currSelectedPiece;
  board[pos.x][pos.y].setColor();
  board[pos.x][pos.y].button.mousePressed(positionSelected.bind(this, pos));
}

function resetNeighbors() {
  // resest neighbor colors
  if (currNeighbors) {
    for (var i = 0; i < currNeighbors.length; i++) {
      currNeighbors[i].setColor();
    }
  }
}

function changeButtonPosition(button, offsetX, offsetY) {
  var leftStr = button.style("left");
  var leftFloat = parseFloat(leftStr.substring(0, leftStr.length - 2));
  var topStr = button.style("top");
  var topFloat = parseFloat(topStr.substring(0, topStr.length - 2));
  leftFloat += offsetX;
  topFloat += offsetY;
  button.style("left", leftFloat.toString() + "px");
  button.style("top", topFloat.toString() + "px");
  return button;
}

function windowResized() {
  // Resize buttons to fit new window size
  var offset = [canvas.position().x - originalCanvasPos.x, canvas.position().y - originalCanvasPos.y]; // offset from original canvas size
  originalCanvasPos.x = canvas.position().x;
  originalCanvasPos.y = canvas.position().y;
  for (var i = 0; i < boardHeight; i++) {
    for (var j = 0; j < boardWidth; j++) {
      if (board[i][j] != null) {
        changeButtonPosition(board[i][j].button, offset[0], offset[1]);
      }
    }
  }
}

function createBoard() {
  // board can be seen as a 13x17 grid
  tempBoard = [];
  var actualRowWidths = [
    1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1
  ];
  var rowOffsets = [
    6, 5, 5, 4, 0, 0, 1, 1, 2, 1, 1, 0, 0, 4, 5, 5, 6
  ];
  var currRowWidth;

  var actualHeight = 17;
  var actualWidth = 13;
  for (var i = 0; i < actualHeight; i++) {
    currRowWidth = actualRowWidths[i];
    tempBoard[i] = []
    var rowOffsetY = rowOffsets[i];
    for (var j = 0; j < actualWidth; j++) {
      if (j >= rowOffsetY && j < rowOffsetY + currRowWidth) {
        tempBoard[i][j] = new BoardLocation(i+2, j+2);
        if (i < 4) {
          if (numOfPlayers != 4) {
            tempBoard[i][j].boardPiece = new BoardPiece(i+2, j+2, Color.RED);
          }
        } else if (i < 8) {
          if ((i == 4 && j < 4) || (i == 5 && j < 3) || (i == 6 && j < 3) || (i == 7 && j < 2)) {
            if (numOfPlayers == 4 || numOfPlayers == 6) {
              tempBoard[i][j].boardPiece = new BoardPiece(i, j, Color.BLUE);
            }
          } else if ((i == 4 && j > 8) || (i == 5 && j > 8) || (i == 6 && j > 9) || (i == 7 && j > 9)) {
            if (numOfPlayers == 4 || numOfPlayers == 6) {
              tempBoard[i][j].boardPiece = new BoardPiece(i, j, Color.GREEN);
            }
          }
        } else if (i < 13) {
          if ((i == 9 && j < 2) || (i == 10 && j < 3) || (i == 11 && j < 3) || (i == 12 && j < 4)) {
            if (numOfPlayers != 2) {
              tempBoard[i][j].boardPiece = new BoardPiece(i, j, Color.YELLOW);
            } 
          } else if ((i == 9 && j > 9) || (i == 10 && j > 9) || (i == 11 && j > 8) || (i == 12 && j > 8)) {
            if (numOfPlayers != 2) {
              tempBoard[i][j].boardPiece = new BoardPiece(i, j, Color.BLACK);
            } 
          }
        } else {
          if (numOfPlayers == 2 || numOfPlayers == 6) {
            tempBoard[i][j].boardPiece = new BoardPiece(i, j, Color.WHITE);
          }
        }
        tempBoard[i][j].setColor();
      } else {
        tempBoard[i][j] = null;
      }
    }
  }

  // add border
  board = [];
  for (var i = 0; i < boardHeight; i++) {
    board[i] = [];
    for (var j = 0; j < boardWidth; j++) {
      if (j < 2 || i < 2 || i > 18 || j > 14) {
        board[i][j] = null;
      } else {
        board[i][j] = tempBoard[i-2][j-2];
      }
    }
  }

  console.log(board);

}

function drawBoard() {
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
  for (var i = 0; i < boardHeight-4; i++) {
    currentOffset[0] = startingPosX - gridOffsets[i];
    for (var j = 0; j < boardWidth-4; j++) {
      var indexOffsetX = i+2;
      var indexOffsetY = j+2;
      if (board[indexOffsetX][indexOffsetY] != null) {
        // Have to offset the buttons based on the position of the canvas
        var newButton = createButton('');
        newButton.id("piece");
        newButton.style("background-color", board[indexOffsetX][indexOffsetY].color);
        newButton.style("border-color", board[indexOffsetX][indexOffsetY].color);
        newButton.mousePressed(positionSelected.bind(this, {x: indexOffsetX, y: indexOffsetY}));
        newButton.position(currentOffset[0], currentOffset[1]);
        changeButtonPosition(newButton, canvas.position().x, canvas.position().y);
        board[indexOffsetX][indexOffsetY].button = newButton;
        currentOffset[0] += offsetX;
      }
    }
    currentOffset[1] +=offsetY;
  }
}
