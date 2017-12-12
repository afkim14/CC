class Room {
  constructor(roomTitle, owner) {
    this.title = roomTitle;
    this.owner = owner;
    this.players = {};
    this.players[owner.socketid] = owner;
    this.id = (+ new Date()).toString() + '/' + owner.socketid.toString();
  }

}

module.exports = Room;
