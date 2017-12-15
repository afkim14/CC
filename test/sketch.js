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

class BoardPiece {
  constructor(row, col) {
    this.position = [row, col];
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
  board = [];
  actualRowWidths = [
    1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1
  ];
  var currRowWidth;
  for (var i = 0; i < boardHeight; i++) {
    currRowWidth = actualRowWidths[i];
    board[i] = []
    for (var j = 0; j < boardWidth; j++) {
      if (j < currRowWidth) {
        board[i][j] = new BoardPiece(i, j);
        if (i < 4) {
          if (numOfPlayers != 4) {
            board[i][j].color = Color.RED;
          } else {
            board[i][j].color = Color.CLOSED;
          }
        } else if (i < 8) {
          if ((i == 4 && j < 4) || (i == 5 && j < 3) || (i == 6 && j < 2) || (i == 7 && j < 1)) {
            if (numOfPlayers == 4 || numOfPlayers == 6) {
              board[i][j].color = Color.BLUE;
            } else {
              board[i][j].color = Color.CLOSED;
            }
          } else if ((i == 4 || i == 5 || i == 6 || i == 7) && j > 8) {
            if (numOfPlayers == 4 || numOfPlayers == 6) {
              board[i][j].color = Color.GREEN;
            } else {
              board[i][j].color = Color.CLOSED;
            }
          } else {
            board[i][j].color = Color.EMPTY;
          }
        } else if (i < 13) {
          if ((i == 9 && j < 1) || (i == 10 && j < 2) || (i == 11 && j < 3) || (i == 12 && j < 4)) {
            if (numOfPlayers != 2) {
              board[i][j].color = Color.YELLOW;
            } else {
              board[i][j].color = Color.CLOSED;
            }
          } else if ((i == 9 || i == 10 || i == 11 || i == 12) && j > 8) {
            if (numOfPlayers != 2) {
              board[i][j].color = Color.BLACK;
            } else {
              board[i][j].color = Color.CLOSED;
            }
          } else {
            board[i][j].color = Color.EMPTY;
          }
        } else {
          if (numOfPlayers == 2 || numOfPlayers == 6) {
            board[i][j].color = Color.WHITE;
          } else {
            board[i][j].color = Color.CLOSED;
          }
        }
      } else {
        board[i][j] = null; // null is good to keep track of neighbors
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
  for (var i = 0; i < boardHeight; i++) {
    currentOffset[0] = startingPosX - gridOffsets[i];
    for (var j = 0; j < boardWidth; j++) {
      if (board[i][j] != null) {
        // Have to offset the buttons based on the position of the canvas
        var newButton = createButton('');
        newButton.id("piece");
        newButton.style("background-color", board[i][j].color);
        newButton.style("border-color", board[i][j].color);
        if (board[i][j].color == myColor) {
          // function that is called when clicking one of the nodes
          newButton.mousePressed(myPieceSelected.bind(this, {x: i, y: j}));
        }
        newButton.position(currentOffset[0], currentOffset[1]);
        changeButtonPosition(newButton, canvas.position().x, canvas.position().y);
        board[i][j].button = newButton;
        currentOffset[0] += offsetX;
      }
    }
    currentOffset[1] +=offsetY;
  }
}

function myPieceSelected(pos) { // pos = [i, j] to 2D board array
  if (currSelectedPiece) {
    currSelectedPiece.button.style("background-color", myColor);
  }

  currSelectedPiece = board[pos.x][pos.y];
  board[pos.x][pos.y].button.style("background-color", Color.EMPTY);

  // activate all possible neigbhors

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
