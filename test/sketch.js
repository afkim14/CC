var canvas;
var constrainedCanvasWidth = 800;
var constrainedCanvasHeight = 800;
var board; // [][]
var numOfPlayers = 2;

class BoardPiece {
  constructor(row, col) {
    this.position = [row, col];
    this.color = null; // change this later
  }
}

function setup() {
  canvas = createCanvas(constrainedCanvasWidth, constrainedCanvasHeight);
  canvas.parent('gameCanvas');
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
  var width = 13;
  var height = 17;
  var currRowWidth;
  for (var i = 0; i < height; i++) {
    currRowWidth = actualRowWidths[i];
    board[i] = []
    for (var j = 0; j < width; j++) {
      if (j < currRowWidth) {
        board[i][j] = new BoardPiece(i, j);
      } else {
        board[i][j] = null; // null is good to keep track of neighbors
      }
    }
  }

  console.log(board);

}

function drawBoard() {
  var width = board[0].length; // 13
  var height = board.length; // 17
  var pieceRadius = 30;
  var offsetX = 55; // can't put in array because its mutating
  var offsetY = 44;
  var startingPosX = constrainedCanvasWidth/2;
  var startingPosY = 44;
  var currentOffset = [startingPosX, startingPosY];
  var gridOffsets = [
    0, offsetX/2, (offsetX/2) * 2, (offsetX/2) * 3,
    (offsetX/2) * 12, (offsetX/2) * 11, (offsetX/2) * 10, (offsetX/2) * 9,
    (offsetX/2) * 8,
    (offsetX/2) * 9, (offsetX/2) * 10, (offsetX/2) * 11, (offsetX/2) * 12,
    (offsetX/2) * 3, (offsetX/2) * 2, (offsetX/2), 0,
  ];

  // draw the board pieces
  for (var i = 0; i < height; i++) {
    currentOffset[0] = startingPosX - gridOffsets[i];
    for (var j = 0; j < width; j++) {
      if (board[i][j] != null) {
        push();
        fill(120,120,120);
        stroke(120,120,120);
        strokeWeight(4);
        ellipse(currentOffset[0], currentOffset[1], pieceRadius);
        pop();
        currentOffset[0] += offsetX;
      }
    }
    currentOffset[1] +=offsetY;
  }


}
