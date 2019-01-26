function Bullet(posLeft){
    this.elem = document.createElement('img');
    this.elem.setAttribute('src', './img/ball-bullet.png');
    this.elem.setAttribute('alt', 'A bullet');
    this.elem.setAttribute('class', 'bullet');
    this.posX = posLeft
    this.elem.style.left = posLeft + '%' ;
    this.elem.style.bottom = '18%';
    this.speed = 150;
    this.posY = 15;
    game.wrapper.appendChild(this.elem);

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
