
const express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/*
// middleware
app.use(function (req, res, next) {
    console.log(arguments)
    next()
})
*/

const players = {}

app.use(express.static('public'));

io.on('connection', function (socket) {
  console.log(`${socket.id} connected`);

  socket.emit('world:init', players, socket.id)

  socket.on('move', function (player) {
      console.log(`${socket.id} moved`)
      players[socket.id] = player
      player.id = socket.id
      socket.broadcast.emit('playerMoved', player)
  });

  socket.on('disconnect', function() {
      const soc = this;
      const currentplayer = players[soc.id];
      console.log('player ' + soc.id +' Got disconnect!');
      delete players[soc.id];
      socket.broadcast.emit('playerDisconnected', soc.id);
   });

})

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

//posicion velocidad inputs se envian al server cada vez que el input cambie no cada frame
// el server broadcast se envian posicion, la veloc i lo inputs
// los clientes reciben estos datos y deben simular las posiciones

//prob:
    //clock de pcs no esta sincronizado
//sol:
    //calcular desfase clock cliente y servidor
    