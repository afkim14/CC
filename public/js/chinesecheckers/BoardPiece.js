class BoardPiece {
  constructor(row, col, color) {
    this.position = {x: row, y: col};
    this.color = color;
  }

  pieceJumped(pos, newPos) {
  	// still need to implement
    return Math.abs(pos.x - newPos.x) + Math.abs(pos.y - newPos.y) > 1;
  }
}
