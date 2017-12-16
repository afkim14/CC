var canvas;
var originalCanvasPos;
var constrainedCanvasWidth = 800;
var constrainedCanvasHeight = 800;
var board; // [][]
var boardWidth = 17;
var boardHeight = 21;
var numOfPlayers = 6; // this will be sent by the server later (2, 3, 4, 6 implemented)
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
var currSelectedPiece; // when user presses a piece
var tempNeighborColors;
var currNeighbors;

class BoardPiece {
  constructor(row, col) {
    this.position = {x: row, y: col};
    this.color = null; // change this later
    this.button = null; // left and top styles
  }
}

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
        tempBoard[i][j] = new BoardPiece(i+2, j+2);
        if (i < 4) {
          if (numOfPlayers != 4) {
            tempBoard[i][j].color = Color.RED;
          } else {
            tempBoard[i][j].color = Color.CLOSED;
          }
        } else if (i < 8) {
          if ((i == 4 && j < 4) || (i == 5 && j < 3) || (i == 6 && j < 3) || (i == 7 && j < 2)) {
            if (numOfPlayers == 4 || numOfPlayers == 6) {
              tempBoard[i][j].color = Color.BLUE;
            } else {
              tempBoard[i][j].color = Color.CLOSED;
            }
          } else if ((i == 4 && j > 8) || (i == 5 && j > 8) || (i == 6 && j > 9) || (i == 7 && j > 9)) {
            if (numOfPlayers == 4 || numOfPlayers == 6) {
              tempBoard[i][j].color = Color.GREEN;
            } else {
              tempBoard[i][j].color = Color.CLOSED;
            }
          } else {
            tempBoard[i][j].color = Color.EMPTY;
          }
        } else if (i < 13) {
          if ((i == 9 && j < 2) || (i == 10 && j < 3) || (i == 11 && j < 3) || (i == 12 && j < 4)) {
            if (numOfPlayers != 2) {
              tempBoard[i][j].color = Color.YELLOW;
            } else {
              tempBoard[i][j].color = Color.CLOSED;
            }
          } else if ((i == 9 && j > 9) || (i == 10 && j > 9) || (i == 11 && j > 8) || (i == 12 && j > 8)) {
            if (numOfPlayers != 2) {
              tempBoard[i][j].color = Color.BLACK;
            } else {
              tempBoard[i][j].color = Color.CLOSED;
            }
          } else {
            tempBoard[i][j].color = Color.EMPTY;
          }
        } else {
          if (numOfPlayers == 2 || numOfPlayers == 6) {
            tempBoard[i][j].color = Color.WHITE;
          } else {
            tempBoard[i][j].color = Color.CLOSED;
          }
        }
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
        if (board[indexOffsetX][indexOffsetY].color == myColor) {
          // function that is called when clicking one of the nodes
          newButton.mousePressed(myPieceSelected.bind(this, {x: indexOffsetX, y: indexOffsetY}));
        }
        newButton.position(currentOffset[0], currentOffset[1]);
        changeButtonPosition(newButton, canvas.position().x, canvas.position().y);
        board[indexOffsetX][indexOffsetY].button = newButton;
        currentOffset[0] += offsetX;
      }
    }
    currentOffset[1] +=offsetY;
  }
}

function myPieceSelected(pos) {
  if (currSelectedPiece) {
    resetCurrPieceAndNeighors(myColor);
  }

  currSelectedPiece = board[pos.x][pos.y];
  board[pos.x][pos.y].button.style("background-color", Color.EMPTY);

  // activate all possible neigbhors
  currNeighbors = getNeighborPieces(currSelectedPiece);
  tempNeighborColors = [];
  for (var i = 0; i < currNeighbors.length; i++) {
    tempNeighborColors.push({ background: currNeighbors[i].button.style("background-color"),
                              border: currNeighbors[i].button.style("border-color") });
  }
  showNeighborPieces(currNeighbors);
}

function getNeighborPieces(p) {
  var neighbors = [];
  var neighborPositions;
  if (p.position.x % 2  == 0) { // even row
    var neighborPositions = [ {x: p.position.x, y: p.position.y-1},
                              {x: p.position.x, y: p.position.y+1},
                              {x: p.position.x-1, y: p.position.y-1},
                              {x: p.position.x-1, y: p.position.y},
                              {x: p.position.x+1, y: p.position.y-1},
                              {x: p.position.x+1, y: p.position.y},
                            ];
  } else {                     // odd row
    var neighborPositions = [ {x: p.position.x, y: p.position.y-1},
                              {x: p.position.x, y: p.position.y+1},
                              {x: p.position.x-1, y: p.position.y+1},
                              {x: p.position.x-1, y: p.position.y},
                              {x: p.position.x+1, y: p.position.y+1},
                              {x: p.position.x+1, y: p.position.y},
                            ];
  }

  for (var i = 0; i < neighborPositions.length; i++) {
    if (board[neighborPositions[i].x][neighborPositions[i].y]) {
      if (board[neighborPositions[i].x][neighborPositions[i].y].color == Color.EMPTY) {
        board[neighborPositions[i].x][neighborPositions[i].y].button.mousePressed(destinationSpotSelected.bind(this, {x: neighborPositions[i].x, y: neighborPositions[i].y}));
        neighbors.push(board[neighborPositions[i].x][neighborPositions[i].y]);
      }
    }
  }

  return neighbors;
}

function showNeighborPieces(neighbors) {
  for (var i = 0; i < neighbors.length; i++) {
    neighbors[i].button.style("background-color", myColor);
    neighbors[i].button.style("border-color", "#000000");
  }
}

function resetCurrPieceAndNeighors(currPieceColor) {
  currSelectedPiece.color = currPieceColor;
  currSelectedPiece.button.style("background-color", currPieceColor);
  currSelectedPiece.button.style("border-color", currPieceColor);
  currSelectedPiece = null;
  for (var i = 0; i < currNeighbors.length; i++) {
    // reset neighbors
    currNeighbors[i].button.style("background-color", tempNeighborColors[i].background);
    currNeighbors[i].button.style("border-color", tempNeighborColors[i].border);
  }
}

function destinationSpotSelected(pos) {
  // TODO: if valid
  currSelectedPiece.button.mousePressed(false);
  resetCurrPieceAndNeighors(Color.EMPTY);
  board[pos.x][pos.y].button.style("background-color", myColor);
  board[pos.x][pos.y].button.style("border-color", myColor);
  board[pos.x][pos.y].button.mousePressed(myPieceSelected.bind(this, pos));
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
