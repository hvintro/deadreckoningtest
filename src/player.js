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

class Player{

    constructor (x,y,color, vx, vy, inputs, isShoting, isJumping, jumpy){
        this.x = x;
        this.y = y;
        this.color =  color;
        this.vx = vx;
        this.vy = vy;
        this.inputs = inputs;
        this.isShoting = isShoting;
        this.isJumping = isJumping;
        this.jumpy = jumpy; 
    }

    
}

module.exports = Player;