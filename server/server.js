
const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//const player = require('./player.js');
const randomColor = require('randomcolor')
//const bulletclass = require ('./bullet.js')
const inputs = {
    LEFT_ARROW: false,
    RIGHT_ARROW: false,
    UP_ARROW: false,
    DOWN_ARROW: false
}


//let players = {}

class gameServer{
    constructor(){
        this.players = {};
    }

    onPlayerConnected (socket){

        //const player = new player (Math.random() * 500,Math.random() * 500,randomColor(), 0 , 0, inputs, false, false, 0);
         const player = {
            x: Math.random() * 500,
            y: Math.random() * 500,
            vx: 0,
            vy: 0,
            color: randomColor(),
            id: socket.id,
            inputs,
            isShoting: false,
            isJumping: false,
            jumpy: 0
        }
        this.players[socket.id] = player; 
        socket.emit('world:init', this.players, socket.id);
        //this.onPlayerMoved(socket, inputs);
    }

    onPlayerMoved(socket, inputss){

        const player = this.players[socket.id]
        player.timestamp = Date.now()
        console.log(inputss);
        player.x = inputss.x;
        console.log("player.x =>" + player.x);
        player.y = inputss.y;
        console.log("player.y =>" + player.y);
        io.sockets.emit('playerMoved', player);

    }

    onPlayerDisconect (socket){
      const currentplayer = this.players[socket.id];
      console.log('player ' + socket.id +' Got disconnect!');
      delete this.players[socket.id];
      socket.broadcast.emit('playerDisconnected', socket.id);
    }

}

const game = new gameServer();

app.use(express.static('public'));

io.on('connection', function (socket) {
    
    console.log(`${socket.id} connected`);
    game.onPlayerConnected(socket);
   
  socket.on('move', function (player) {
      game.onPlayerMoved(socket, inputs)
  });

  socket.on('disconnect', function() {
      game.onPlayerDisconect(socket);
   });

})

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

    