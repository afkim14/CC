class Player {
  constructor(color) {
    this.color = color;
    this.currSelectedSpot = null;
    this.currNeighbors = null;
    this.turn = false;
  }

  resetCurrPieceAndNeighbors() {
    this.currSelectedSpot.setColor();
    // resest neighbor colors
    if (this.currNeighbors) {
      for (var i = 0; i < this.currNeighbors.length; i++) {
        this.currNeighbors[i].setColor();
      }
    }
  }
}
