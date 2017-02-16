class Bullet{
    
   

    constructor(player, ctx, isright, delta){
        const yinit = 25;
        const xinit = 10;

        this.velocity = 12;
        this.x = isright ? player.x + xinit + 50 : player.x - xinit;
        this.y = player.y + 25;
        this.isAlive = true;
        this.id = player.id;
        this.radius = 5;
        this.acceleration = 0.002;
        this.isright = isright;
        this.player = player;
        this.delta = delta;
    }

    render(ctx){
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        //ctx.fillRect(player.x + 60,0,)
        ctx.fillStyle = this.player.color;
        ctx.fill();
        if (this.isright){
            this.x += this.velocity * this.delta;
        }else{
            this.x -= this.velocity * this.delta;
        }

    }



}

module.exports =  Bullet;