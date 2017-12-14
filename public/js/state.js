/*

  STATE.JS : HANDLE STATE TRANSITIONS AND LOADING DIFFERENT HTML CONTENT FOR EACH STATE

*/

var State = {
    LOGIN : 0,
    MAIN : 1,
    CREATEROOM : 2,
    LOBBY: 3,
    GAME: 4
}
var state = State.LOGIN;

function toggleView() {
  switch(state) {
    case State.LOGIN:
      const loginHTML = `
          <div class=\"center_container\" style=\"margin-top: 20%;\">
            <p class=\"h1\">CHINESE CHECKERS</p>
            <input type=\"text\" id=\"username\" placeholder=\"Username\"><br>
            <p class=\"h2\" id=\"reply\"></p>
            <button id=\"submit\" onClick=\"sendUsernameToServer()\">LOGIN</button>
          </div>
      `;
      document.getElementById("content").innerHTML = loginHTML;
      document.getElementById("username").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("submit").click();
        }
      });
      break;
    case State.MAIN:
      const mainHTML = `
          <div class=\"center_container\">
            <p class=\"h1\">Main Page</p>
            <button style=\"width: 200px;\" onClick=\"switchToState(2)\">Create Room</button>
            <div id="roomsContainer"></div>
          </div>
      `;

      var roomString = "";
      for (var key in rooms) {
        if (rooms.hasOwnProperty(key)) {
          roomString += "<div class=\"room_container\">";
          if (Object.keys(rooms[key].players).length >= 6) { roomString += "<p class=\"room_title\">" + rooms[key].title + "</p>" }
          else { roomString += "<a class=\"room_title\" onclick=enterRoom(\"" + key + "\")>" + rooms[key].title + "</a>" }
          roomString += "<div class=\"room_info_container\">";
          roomString += "<p class=\"room_capacity\">" + "(" + Object.keys(rooms[key].players).length + "/6" + ")" + " players" + "</p>"
                      + "<p class=\"room_owner\">created by " + rooms[key].owner.username + ".</p>";
          roomString += "</div>"
          roomString += "</div>";
        }
      }
      document.getElementById("content").innerHTML = mainHTML;
      document.getElementById("roomsContainer").innerHTML = roomString;
      break;
    case State.CREATEROOM:
      const createRoomHTML = `
          <div class=\"center_container\">
            <p class=\"h1\">Room Creation</p>
            <input type=\"text\" id=\"roomTitle\" placeholder=\"Room Title\"><br>
            <p class=\"h2\" id=\"reply\"></p>
            <button id=\"submit\" style=\"width: 130px;\" onClick=\"createRoom()\">Create Room</button>
          </div>
      `;
      document.getElementById("content").innerHTML = createRoomHTML;
      document.getElementById("roomTitle").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("submit").click();
        }
      });
      break;
    case State.LOBBY:
      const lobbyHTML = `
          <div class=\"center_container\">
            <p class=\"h1\" id="roomName"></p>
            <p class=\"h2\" id="roomName">Players</p>
            <div id=\"members_container\"></div>
            <button style=\"margin-right: 20px; margin-top: 10px; display: inline-block;\" onClick=\"setupGame()\">Start Game</button>
            <button style=\"margin-top: 10px; display: inline-block;\" onClick=\"quitRoom()\">Quit Room</button>
          </div>
      `;
      document.getElementById("content").innerHTML = lobbyHTML;
      document.getElementById("roomName").innerHTML = currentRoom.title;
      var memberString = "";
      for (var socketid in currentRoom.players) {
        memberString += "<div class=\"user_container\">";
        memberString += "<p class=\"username_text\">" + currentRoom.players[socketid].username + "</p>";
        memberString += "</div>";
      }
      document.getElementById("members_container").innerHTML = memberString;
      break;
    case State.GAME:
      const gameHTML = `
          <div id="gameCanvas" style="text-align: center;"></div>
      `;
      document.getElementById("content").innerHTML = gameHTML;
      break;
  }
}

function switchToState(stateKey) {
  switch(stateKey) {
    case State.CREATEROOM:
      state=State.CREATEROOM;
      toggleView();
      break;
    case State.MAIN:
      getRooms();
      currentRoom = null;
      state=State.MAIN;
      toggleView();
      break;
    case State.LOBBY:
      state = State.LOBBY;
      toggleView();
      break;
    case State.GAME:
      state = State.GAME;
      toggleView();
      break;
  }
}

toggleView();
