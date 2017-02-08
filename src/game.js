
const kbd = require('@dasilvacontin/keyboard')
const randomColor = require('randomcolor')
document.addEventListener('keydown', function (event) {
    event.preventDefault()
})
const socket = io();

//creating canvas
const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')
//creating player
let myPlayerId = null;
const myPlayer = {x:100, y:100, color: randomColor() }
//getting all players
let players = {}


function gameloop(){
    requestAnimationFrame(gameloop);
    logic();
    render();
}

requestAnimationFrame(gameloop);

function logic () {
    if (kbd.isKeyDown(kbd.LEFT_ARROW)) {
        myPlayer.x--
    } else if (kbd.isKeyDown(kbd.RIGHT_ARROW)) {
        myPlayer.x++
    }
    socket.emit('move', myPlayer)
}

function render () {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    for (let playerId in players) {
        const { color, x, y } = players[playerId]
        ctx.fillStyle = color
        ctx.fillRect(x, y, 50, 50)
        if (playerId === myPlayerId) {
            ctx.strokeRect(x, y, 50, 50)
        }
    }
}

//server connection
socket.on('connect', function () {
    socket.on('world:init', function (serverPlayers, myId) {
        //getting player from server
        console.log("word created!");
        myPlayerId = myId
        myPlayer.id = myId
        players = serverPlayers
        players[myId] = myPlayer
    })

    socket.on('playerMoved', function (player) {
        players[player.id] = player
    })

    socket.on('playerDisconnected', function(playerid) {
      console.log(players[playerid] + 'Got disconnected');
      delete players[playerid];
   });

})