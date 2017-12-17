
// GLOBAL VARIABLES
var canvas;
var originalCanvasPos;
var constrainedCanvasWidth = 800;
var constrainedCanvasHeight = 800;
var board; // [][]
var player; // new Class User
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

function setup() {
  canvas = createCanvas(constrainedCanvasWidth, constrainedCanvasHeight);
  canvas.parent('gameCanvasContainer');
  originalCanvasPos = canvas.position();
  background(100, 100, 100);
  player = new User(Color.RED); // color given by server
  board = new Board(6); // numofplayers given by server
}

function draw() {

}

/*
  =====================================================================================================
  Helper functions to resize window, canvas, and button positions
  =====================================================================================================
*/

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
  for (var i = 0; i < board.boardHeight; i++) {
    for (var j = 0; j < board.boardWidth; j++) {
      if (board.spots[i][j] != null) {
        changeButtonPosition(board.spots[i][j].button, offset[0], offset[1]);
      }
    }
  }
}
