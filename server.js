var setup = require('./server/setup');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('new user', function(username) {
    var newUser = setup.createUser(username, socket.id);
    users.push(newUser);
  });
});

/*
io.on('disconnect', function(socket) {
  console.log("fdsafas");
});
*/

http.listen(port, function(){
  console.log('listening on *:' + port);
});
