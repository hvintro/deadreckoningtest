
const teclado = require('@dasilvacontin/keyboard')
const randomColor = require('randomcolor')
const bulletclass = require ('./bullet.js')
const Player = require('./player.js');
const socket = io();
var bullet;

//creating canvas
const canvas = document.createElement('canvas')
canvas.width = 900;
canvas.height = window.innerHeight - 50;
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d');
//listeners
document.addEventListener('keyup',checkKeyUp, true);
document.addEventListener('keydown', function (event) {event.preventDefault()});
var isSpaceUp;
const gravity = 0.8;

/*
//dibujar el 

ctx.beginPath;
ctx.lineTo(100,50);
ctx.lineTo(0,50);
ctx.lineTo(0,0); //pinta linea
//moveto; //muebe el lapiz
//creating player

ctx.closePath;
*/

let myPlayerId = null;
/*const myPlayer = {
    x:100,
    y:canvas.height - 50, 
    color: randomColor(),
    vy:0,
    vx:10,
    inputs : {
        1:false,
        2:false,
        3:false,
        4:false
        },
    isShotting: false,
    isJumping: false,
    jumpy: 0
}*/

const myPlayer = new Player(100, canvas.height - 50, randomColor(), 0, 10, { 1:false,2:false,3:false,4:false},false, false );

const Paint = {
    RECTANGLE_STROKE_STYLE : 'black',
    RECTANGLE_LINE_WIDTH : 1,
    VALUE_FONT : '12px Arial',
    VALUE_FILL_STYLE : 'red'
}

let lastMovementRight = false;

//getting all players
let players = {};
let bullets = [];

function gameloop(){
    requestAnimationFrame(gameloop);
    logic();
    render();
}

requestAnimationFrame(gameloop);
//Reposcion del objeto para cada frame
function logic () {
    let wx = myPlayer.vx;
    let wy = myPlayer.vy;

    if (teclado.isKeyDown(teclado.LEFT_ARROW) && !teclado.isKeyDown(teclado.RIGHT_ARROW) && myPlayer.x >= 1) {
        myPlayer.x-= wx;
        lastMovementRight = false;
    } else if (teclado.isKeyDown(teclado.RIGHT_ARROW) && !teclado.isKeyDown(teclado.LEFT_ARROW) && myPlayer.x <= (canvas.width - 51)) {
       lastMovementRight = true;
        myPlayer.x+= wx;
    
    }else if (teclado.isKeyDown(teclado.DOWN_ARROW) && !teclado.isKeyDown(teclado.UP_ARROW) && myPlayer.y <= (canvas.height-51)){
         //myPlayer.vy++
        //  myPlayer.y+=4;  
    }else if(teclado.isKeyDown(teclado.SPACE_BAR)){
           // myPlayer.isShotting = true;
    }

    if (teclado.isKeyDown(teclado.UP_ARROW) && !teclado.isKeyDown(teclado.DOWN_ARROW) && myPlayer.y >= 1){
        //myPlayer.vy--
        //myPlayer.y-=4;
        jump(myPlayer);}

    if (isSpaceUp){
            
        let buttel = new bulletclass (myPlayer,ctx,lastMovementRight);
        bullets.push(buttel);
        //myPlayer.isShotting = false;
        isSpaceUp = false;
    }

     
     if (myPlayer.isJumping && myPlayer.y < myPlayer.jumpy){
         console.log("isjumping");
        myPlayer.vy-=gravity;
         myPlayer.y -= myPlayer.vy;
     }else if (myPlayer.isJumping){
         console.log("END isjumping");
        myPlayer.vy = 0;
        myPlayer.y = myPlayer.jumpy;
        myPlayer.jumpy = 0;
        myPlayer.isJumping = false
     }

     console.log("VY" + myPlayer.vy);
     
   
}

function render () {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    for (let playerId in players) {
        const { color, x, y } = players[playerId]
        ctx.fillStyle = color
        ctx.fillRect(x, y, 50, 50)
        if (playerId === myPlayerId) {
            ctx.strokeRect(x, y, 50, 50)
            set_text(x,y,ctx);    
        }
        if (lastMovementRight){
            paint_lines(players[playerId]);
        }else{
            paint_lines(players[playerId],true);                
        }

    }

    renderAllBullets(ctx)
}

function jump (player){
   
    if (!player.isJumping){
        console.log("jump!");
        player.isJumping = true;
        player.jumpy = player.y;
        player.vy =  player.vx*(1.5) - gravity;
        player.y -= player.vy;

    }
}

function set_text(x,y,ctx){

        let text = "life";
        ctx.textBaseline = "middle";
        ctx.font = Paint.VALUE_FONT;
        ctx.fillStyle = Paint.VALUE_FILL_STYLE;
        // ctx2d.measureText(text).width/2 
        // returns the text width (given the supplied font) / 2
        let textX = x+50/2 - ctx.measureText(text).width/2;
        let textY = y+50/2;
        ctx.fillText(text, textX, textY);
}

function paint_lines(player,left){
    let lines = {};
    if (left) {
        lines = {
            one: player.x + 10,
            two: player.x + 7,
            three: player.x + 4
        }
    }else{
        lines = {
            one: player.x + (50-10),
            two: player.x + (50-7),
            three: player.x + (50-4)
        }
    }
    ctx.beginPath();
    ctx.moveTo(lines.one,player.y);
    ctx.lineTo(lines.one,player.y+50);
    ctx.moveTo(lines.two,player.y);
    ctx.lineTo(lines.two,player.y+50);
    ctx.moveTo(lines.three,player.y);
    ctx.lineTo(lines.three,player.y+50);
    //ctx.lineWidth=10;
    //ctx.strokeStyle = "#ff0000"
    ctx.stroke();
}


function renderAllBullets(ctx){
    if (bullets.length > 0){
        for (bull in bullets){
            if (bullets[bull].x > (canvas.width - bullets[bull].radius)  || bullets[bull].x < 1 || 
            bullets[bull].y > (canvas.heigth - bullets[bull].radius) || bullets[bull].y < 0){
                console.log("Bullet " + bullets[bull].id + " collides!");
                delete bullets[bull];
            }else{
                bullets[bull].render(ctx);
            }
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

function checkKeyUp(e){
    if (e.keyCode == 32) {
        isSpaceUp = true;
    }
}