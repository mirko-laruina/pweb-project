function Cannon(speed, cannonFrequency){
    this.elem = document.getElementById("cannon");
    this.posX = 50;
    this.elem.style.left = this.posX + '%';
    this.dir = 's'
    this.shootFrequency = cannonFrequency;
    this.speed = speed;
    this.bulletArray = new Array();
    this.height = 15;
    this.width = game.wrapper.clientHeight*this.height/(1.83*game.wrapper.clientWidth);
    this.posY = 100-80;
    this.move = cannonMove;
    this.shoot = cannonShoot;
    this.start = cannonStart;
}

function cannonStart(){
    var that = this;
    this.shootInterval = setInterval(function(){
        if(game.pause) return;
        that.shoot();
    }, this.shootFrequency);

    this.moveInterval = setInterval(function(){
        if(game.pause) return;
        that.move()
    }, 1000/game.fps);
}

function cannonMove(){
    if(this.dir == 'r'){
        this.posX += this.speed/game.fps;
        if(this.posX > 98){
            this.posX = 98;
        }
    } else if (this.dir == 'l') {
        this.posX -= this.speed/game.fps;
        if(this.posX < 2){
            this.posX = 2;
        }
    } else
        return;

    this.elem.style.left = this.posX + '%';
}

function cannonShoot(){
    var b = new Bullet(parseFloat(this.elem.style.left));
    var that = this;
    b.intervalId = setInterval(function() {
        if(game.pause) return;
        var res = b.move();
        if(res > 100){
            b.remove();
            //Push appends, so the first element is the oldest
            that.bulletArray.shift();
        }
    }, 1000/game.fps);
    this.bulletArray.push(b);
}