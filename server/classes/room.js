class Room {
  constructor(roomTitle, owner, type) {
    this.title = roomTitle;
    this.owner = owner;
    this.type = type;
    this.players = {};
    this.players[owner.socketid] = owner;
    this.id = (+ new Date()).toString() + '/' + owner.socketid.toString();
    this.turnIndex = 0;
  }

}

module.exports = Room;
