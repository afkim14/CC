class User {
  constructor(color) {
    this.color = color;
    this.currSelectedSpot = null;
    this.currNeighbors = null;
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
