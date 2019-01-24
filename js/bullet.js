function Bullet(posLeft){
    this.elem = document.createElement('img');
    this.elem.setAttribute('src', './img/ball-bullet.png');
    this.elem.setAttribute('alt', 'A bullet');
    this.elem.setAttribute('class', 'bullet');
    game.wrapper.appendChild(this.elem);
    this.posX = posLeft
    this.elem.style.left = posLeft + '%' ;
    this.elem.style.bottom = '15%';
    this.speed = 100;
    this.posY = 15;

    this.move = moveBullet;
    this.remove = removeBullet;
}

function moveBullet(){
    this.posY = this.posY + this.speed/game.fps;
    this.elem.style.bottom = this.posY + '%';
    return this.posY;
}

function removeBullet(){
    game.wrapper.removeChild(this.elem);
    clearInterval(this.intervalId);
}
