function BallMaster(maxSize, maxBalls){
    this.maxBalls = maxBalls;
    this.maxSize = maxSize;
    this.ballArray = new Array();
    this.spawn = spawnBall;
    this.burst = burstBall;
    this.spawnMoney = spawnMoneyBall;
}

function spawnBall(size, speed, value, posX, posY){
    if(this.maxBalls <= this.ballArray.length){
        return;
    }
    if(size > this.maxSize)
        size = this.maxSize;
    else if (size < 1)
        size = 1;
    
    var newBall = new Ball(size, speed, value, posX, posY);

    newBall.intervalId = setInterval(function(){
        if(game.pause) return;
        newBall.moveX();
        newBall.moveY();
    }, 1000/game.fps);
    this.ballArray.push(newBall);
}

function burstBall(index){
    //overcomplicated, but index may vary and I could flag as non-active a ball which is not
    var ball = this.ballArray.slice(index, index+1)[0];
    ball.active = false;
    var intervalId = ball.intervalId;
    var ballElem = ball.elem;

    clearInterval(intervalId);
    setTimeout(function(){
        //wait for a previous bubbling to finish (following animation will not play otherwise)
        ballElem.style.width = ball.width*50 + '%';
        ballElem.style.opacity = 0;
        ballElem.style.transform = 'translateY(50%) translateX(-50%)';
    }, 100);

    for(var i = 0; i<ball.size; i++){
        this.spawnMoney(ball.posX, ball.posY);
    }

    setTimeout(function(self){
        //see first comment of this function
        self.ballArray.splice(self.ballArray.indexOf(ball), 1);
        game.wrapper.removeChild(ballElem);
        /*for (var b in self.ballArray){
            b.active = true;
        }*/
    }, 500, this)

}

function spawnMoneyBall(posX, posY){
    var randomness = 8;
    var money = document.createElement('img');
    money.setAttribute('class', 'money');
    money.setAttribute('alt', 'Diamanti');
    money.setAttribute('src', './img/diamond.png');
    money.style.bottom = posY + Math.random()*randomness - randomness/2 + '%';
    money.style.left = posX + Math.random()*randomness - randomness/2 + '%';
    game.wrapper.appendChild(money);
    setTimeout(function(){
        money.style.bottom = posY + 15 + '%';
        money.style.opacity = 0;
        setTimeout(function(){
            game.wrapper.removeChild(money);
        }, 1000);
    }, 100);

    addMoney(1);
}

function Ball(size, speed, value, posX, posY){
    this.elem = document.createElement('div');
    this.img = document.createElement('img');
    this.label = document.createTextNode(value);
    this.p = document.createElement('p');
    this.p.appendChild(this.label);
    this.elem.appendChild(this.p);
    this.elem.appendChild(this.img);
    this.initialValue = value;
    this.size = size;
    this.width = 0;
    this.elem.setAttribute('class', 'ball');
    this.img.setAttribute('alt', 'A ball');
    imgNumber = Math.floor(Math.random()*5 + 1);
    this.img.setAttribute('src', './img/bubble-' + imgNumber + '.png');
    this.active = true;

    switch(size){
        case 1:
            this.width = 5;
            this.fsize = 1.8;
            break;
        case 2:
            this.width = 8;
            this.fsize = 2.8;
            break;
        case 3:
        default:
            this.width = 11;
            this.fsize = 4;
            break;
    }

    this.p.style.fontSize = this.fsize + 'em';
    this.elem.style.width = this.width + '%'
    if(posX == undefined || posY == undefined){
        this.posX = -10 + (Math.floor(Math.random()*2)*120); //-10 o 110
        this.posY = 70 + Math.random()*20; //70-90
    } else {
        this.posX = posX;
        this.posY = posY;
    }
    this.elem.style.left = this.posX + '%';
    this.elem.style.bottom = this.posY + '%';
    this.speedX = speed;
    this.speedY = 0;
    this.moveX = ballMoveX;
    this.moveY = ballMoveY;
    this.bubbleEffect = bubbleBall;

    game.wrapper.appendChild(this.elem);
}

function ballMoveX(){
    this.posX = parseFloat(this.elem.style.left);
    this.posX += this.speedX/game.fps;
    if(this.posX+this.width > 100){
        this.speedX = -Math.abs(this.speedX);
    } else if (this.posX <= 0){
        /* cause it starts at -10, I need abs */
        this.speedX = Math.abs(this.speedX);
    }
    this.elem.style.left = this.posX + '%';
}

function ballMoveY(){
    this.posY = parseFloat(this.elem.style.bottom);
    this.speedY -= game.gravity/game.fps;

    this.posY += this.speedY/game.fps;

    if(this.posY <= 6){
        this.speedY = Math.abs(this.speedY); //urto anelastico
    }
    //controllare bordo alto non serve: conservazione dell'energia
    
    this.elem.style.bottom = this.posY + '%';
}

function bubbleBall(){
    this.elem.style.width = this.width*1.2 + '%';
    setTimeout(function(self){
        self.elem.style.width = self.width + '%';
    }, 100, this)
}