var p5js;
var canvas;
var originalCanvasPos;
var constrainedCanvasWidth = 800;
var constrainedCanvasHeight = 800;
var board;
var player;
var Color;

function startCCGame(allcolors, playercolors) {
  var sketch = function( p ) {
    p5js = p;
    p.setup = function() {
     canvas = p.createCanvas(constrainedCanvasWidth, constrainedCanvasHeight);
     canvas.parent('gameCanvas');
     originalCanvasPos = canvas.position();
     p.background(100, 100, 100);
     player = new Player(allcolors[playercolors[socket.io.engine.id]]);
     board = new Board(playercolors);
    };

    p.draw = function() {};

    p.windowResized = function() {
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
  };

   var myp5 = new p5(sketch);
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
