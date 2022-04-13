const express = require("express"); // use express
const app = express(); // create instance of express
const server = require("http").Server(app); // create server
const io = require("socket.io")(server); // create instance of socketio

app.use(express.static("public")); // use "public" directory for static files
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
	res.render(__dirname + '/public/index.ejs', {username: "Repl.it User"});
});
const users = {};// create dictionary of users and their socket ids
const rooms = {};
const ready = {};
const games = {};
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


io.on("connection", socket => {
  socket.on("score", ({ runs, game_id }) => {
    console.log(runs);
    console.log(game_id)
    var username = users[socket.id]["username"]
    var room = rooms[users[socket.id]["room"]]
    games[game_id][username] = runs
    if (Object.values(games[game_id])[0] !== "" && Object.values(games[game_id])[1] !== "") {

      const result = Object.entries(games[game_id]).reduce((a, b) =>       a[1] > b[1] ? a : b)[0]
        
        
      let username = users[socket.id]["username"]; // get username of user
    let room = users[socket.id]["room"] // get room the user was in
      console.log(games);
    io.to(room).emit("gameover", {winner: result}); // tell the 
      
      rooms[room].forEach(element => games[game_id][element] = "")
    }

  
  })
  socket.on("joined", (username, room) => { // when server recieves the "joined" message
    ready[username] = false
    socket.join(room); // join the room
    io.to(room).emit("joined", username); // tell the clients in the room that someone has joined
    users[socket.id] = {username:username,room:room}; 
    // add user to dictionary
    if (rooms[room] == null) {
      rooms[room] = []
      
    }
    rooms[room].push(username)
    console.log(rooms);
    
  });
  socket.on("ready", () => { // when someone is ready to play
    username = users[socket.id]["username"]
    var room = rooms[users[socket.id]["room"]]
    const allEqual = arr => arr.every( v => ready[v] === true )

    ready[username] = true
    if (room.length == 2 && allEqual(room) == true) {
      console.log('its 2!')
      room.forEach(element => ready[element] = false)
      
      game_id = makeid(15)
      games[game_id] = {}
      room.forEach(element => games[game_id][element] = "")
      
      console.log(games)
      console.log(rooms)
      socket.join(room)
      
    let room2 = users[socket.id]["room"] // get room the user was in
    io.to(room2).emit("start", game_id);
    }
  });
  /*socket.on("disconnect", () => { // when someone closes the tab
    let username = users[socket.id]["username"]; // get username of user
    let room = users[socket.id]["room"] // get room the user was in
    io.to(room).emit("leave", username); // tell the clients in the room that someone has left
    delete users[socket.id]; // remove user from dictionary
  });*/
});

server.listen(3000); // run server