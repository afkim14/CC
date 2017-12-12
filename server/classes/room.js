class Room {
  constructor(roomTitle, owner) {
    this.title = roomTitle;
    this.owner = owner;
    this.players = {};
    this.players[owner.socketid] = owner;
  }
}

module.exports = Room;
