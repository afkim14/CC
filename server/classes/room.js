class Room {
  constructor(roomTitle, owner, type) {
    this.title = roomTitle;
    this.owner = owner;
    this.type = type;
    this.players = {};
    this.players[owner.socketid] = owner;
    this.id = (+ new Date()).toString() + '/' + owner.socketid.toString();
  }

}

module.exports = Room;
