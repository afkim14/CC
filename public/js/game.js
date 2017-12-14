/*

  GAMESETUP.JS : HANDLES SERVER-CLIENT INTERACTION FOR GAME

*/

function setupGame() {
  // TODO: add interaction with server to ask if it is valid to start a gameHTML
  switchToState(4); // State.GAME
  startGame();
}

function startGame() {
  var sketch = function( p ) {
    var canvas;
    var constrainedCanvasWidth = 800;
    var constrainedCanvasHeight = 800;

    p.setup = function() {
     canvas = p.createCanvas(constrainedCanvasWidth, constrainedCanvasHeight);
     canvas.parent('gameCanvas');
    };

    p.draw = function() {
     p.background(100, 100, 100);
     //p.fill(255);
     //p.rect(x,y,50,50);
    };
  };

   var myp5 = new p5(sketch);
}
