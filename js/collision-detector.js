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
        for (var i = 0; i<that.bm.ballArray.length; i++){
            if(game.lost) break;
            ball = that.bm.ballArray[i];
            ballRadius = ball.width/2;
            ballCenterX = ball.posX+ballRadius;
            ballCenterY = ball.posY+ballRadius;
            for(var j = 0; j<that.c.bulletArray.length; j++){
                if(!ball.active) break; //currently bursting
                if(game.lost) break;
                bullet = that.c.bulletArray[j];
                //bullet.posX is already centered with CSS

                distX = ballCenterX-bullet.posX;
                distY = ballCenterY-bullet.posY-1.5;
                if(distX > -7 && distX < 7 && distY > -7 && distY < 7){
                    //the first if is a quickest way to get rid of the majority of balls
                    //7 is the maximum ball radius (5.5) + cannon radius (1.5) 
                    if(Math.pow((distX), 2) + Math.pow((distY), 2)
                        <= Math.pow((ballRadius + 1.5), 2)){
                        bullet.remove();
                        that.c.bulletArray.splice(j, 1);
                        ball.currentValue -= 1;
                        if(ball.currentValue == 0){
                            ball.label.nodeValue = '';
                            that.bm.burst(i, true);
                        } else {
                            ball.label.nodeValue = ball.currentValue;
                            ball.bubbleEffect();
                        }
                        addPoints(1);
                    }
                }
            }

            if(Math.pow((cannon.posX - ballCenterX), 2) + Math.pow((cannon.posY-cannon.height/3 - ballCenterY), 2)
                <= Math.pow((ballRadius+cannon.width/4), 2)){
                    //The check is needed because it can happen a detection
                    //after lost is called, so when games resumes automatically re-ends
                    if(that.bm.ballArray[i].active == true)
                        lost();
                    that.bm.ballArray[i].active = false;
            }

        }
    }, 1000/game.fps)
}

function decreaseLabel(label){
    label = parseInt()
}