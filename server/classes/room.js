class Room {
  constructor(roomTitle, owner) {
    this.title = roomTitle;
    this.owner = owner;
    this.players = [owner];
  }
}

module.exports = Room;
