function CollisionDetector(cannon, ballmaster){
    this.c = cannon;
    this.bm = ballmaster;
    this.start = startCD;
    this.decreaseLabel = decreaseLabel;
}

function startCD(){
    var that = this;
    setInterval(function(){
        if(game.pause) return;
        for (var i in that.bm.ballArray){
            ball = that.bm.ballArray[i];
            ballRadius = ball.width/2;
            ballCenterX = ball.posX+ballRadius;
            ballCenterY = ball.posY+ballRadius;
            for(var j in that.c.bulletArray){
                if(!ball.active) break; //currently bursting
                bullet = that.c.bulletArray[j];
                bulletTopY = bullet.posY+3;
                bulletCenterX = bullet.posX; //already centered with CSS

                if((ballCenterX-bulletCenterX)**2 + (ballCenterY-bulletTopY)**2 <= ballRadius**2
                    || (ballCenterX-bulletCenterX+1.5)**2 + (ballCenterY-bullet.posY+1.5)**2 <= ballRadius**2
                    || (ballCenterX-bulletCenterX-1.5)**2 + (ballCenterY-bullet.posY+1.5)**2 <= ballRadius**2){
                    bullet.remove();
                    that.c.bulletArray.splice(j, 1);
                    if(ball.label.nodeValue == 1){
                        ball.label.nodeValue = '';
                        that.bm.burst(i, true);
                    } else {
                        ball.label.nodeValue = parseInt(ball.label.nodeValue) - 1;
                        ball.bubbleEffect();
                    }
                    addPoints(1);
                }
            }

            if((cannon.posX - ballCenterX)**2 + (cannon.posY-cannon.height/3 - ballCenterY)**2
                <= (ballRadius+cannon.width/4)**2){
                lost();
            }

        }
    }, 1000/game.fps)
}

function decreaseLabel(label){
    label = parseInt()
}