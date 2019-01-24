var game, cannon, bm, cd;
var intro;

function init(){
    game = {
        wrapper: document.getElementById("game-wrapper"),
        fps: 60,
        pause: true,
        gravity: 30,
        points: document.createTextNode(0),
        money: document.createTextNode(0)
    }
    document.getElementById("points-value").appendChild(game.points);
    document.getElementById("money-value").appendChild(game.money);
    intro = document.getElementById("intro");
    lostMessage = document.getElementById("lost-game");
    pauseMessage = document.getElementById("pause");
}

function keydownHandler(event){
    //Per compatibilita': Chrome e IE hanno event globale
    //Firefox necessita che glielo si passi come argomento
    event = event || window.event;
    if(game == undefined) return;

    if(game.pause && event.key == "Enter"){
        startGame();
    }
    if(game.lost == true) return;

    if(event.key == 'p' || event.key == ' '){
        pause();
        return;
    }

    if(game.pause) return;

    switch(event.key){
        case "ArrowLeft":
        case  'a':
            cannon.dir = 'l';
            break;
        case "ArrowRight":
        case 'd':
            cannon.dir = 'r';
            break;
    }
}

function keyupHandler(event){
    if(game == undefined || game.pause) return;
    event = event || window.event;
    if(event.key == "ArrowLeft"){
        if(cannon.dir == 'l'){
            cannon.dir = 's';
        }
    } else if (event.key == "ArrowRight"){
        if(cannon.dir == 'r'){
            cannon.dir = 's';
        }
    }
}

function startGame(){
    /* clean-up when already played*/
    clearInterval(game.spawnerInterval);
    if(cannon != undefined){
        clearInterval(cannon.moveInterval);
        clearInterval(cannon.shootInterval);
        for (var i in cannon.bulletArray){
            cannon.bulletArray[i].remove();
        }
    }
    if(bm != undefined)
        for (var i in bm.ballArray){
            bm.burst(i, false);
        }
    game.points.nodeValue = 0;
    game.lost = false;

    intro.classList.remove('down');
    lostMessage.classList.remove('down');
    game.pause = false;

    cannon = new Cannon(50, 100);
    bm = new BallMaster(3, 5);
    cd = new CollisionDetector(cannon, bm);
    cd.start();
    cannon.start();

    game.spawnerInterval = setInterval(function(){
        if(game.pause) return;
        bm.spawn(Math.floor(Math.random()*3+1),
                Math.random()*10 + 5,
                Math.floor(Math.random()*30)+1);
    }, 600 );
}

function addPoints(value){
    game.points.nodeValue = value + parseInt(game.points.nodeValue);
}

function addMoney(value){
    game.money.nodeValue = value + parseInt(game.money.nodeValue);
}

function lost(){
    game.pause = true;
    game.lost = true;
    lostMessage.classList.add('down');
}

function pause(){
    if(game.pause){
        pauseMessage.classList.remove('down');
    } else {
        pauseMessage.classList.add('down');
    }
    game.pause = !game.pause;
}