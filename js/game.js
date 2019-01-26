var game, cannon, bm, cd, user;

function init(){
    game = {
        wrapper: document.getElementById("game-wrapper"),
        fps: 60,
        pause: true,
        lost: true,
        gravity: 30,
        count: 0
    }
    if(user == undefined){
        user = {
            points: 0,
            money: 0,
            highscore: 0,
            shootLvl: 1,
            moveLvl: 1,
            name: null,
            logged: 0
        }
    }

    //DOM Calls are heavy, let's make them only once
    pointsElem = document.createTextNode(user.points);
    moneyElem = document.createTextNode(user.money);
    document.getElementById("points-value").appendChild(pointsElem);
    document.getElementById("money-value").appendChild(moneyElem);
    intro = document.getElementById("intro");
    lostMessage = document.getElementById("lost-game");
    pauseMessage = document.getElementById("pause");
    pauseBtn = document.getElementById("pause-btn");
    powerUpMsg = document.getElementById("power-up-msg");
    loginMsg = document.getElementById("login-msg");
    docMsg = document.getElementById("doc-page");
    highscoreElem = document.getElementById("highscore");
    moveLvlElem = document.getElementById("move-current-lvl");
    shootLvlElem = document.getElementById("shoot-current-lvl");
    powerMoveCostElem = document.getElementById("move-power-cost");
    powerShootCostElem = document.getElementById("shoot-power-cost");
    setHighscore();
}

function keydownHandler(event){
    //Per compatibilita': Chrome e IE hanno event globale
    //Firefox necessita che glielo si passi come argomento
    // 13 - Enter
    // 80 - p / ' ' - 32
    // 39 ->, 37 <-
    // 65 a, 68 d
    // 27 ESC

    event = event || window.event;
    if(game == undefined) return;

    if(game.pause && game.lost && event.keyCode == 13){
        closeAllMenu();
        startGame();
    }
    if(game.lost == true) return;

    if(event.keyCode == 80 || event.keyCode == 32 || event.keyCode == 27){
        pause();
        return;
    }

    if(game.pause) return;

    switch(event.keyCode){
        case 37:
        case 65:
            cannon.dir = 'l';
            break;
        case 39:
        case 68:
            cannon.dir = 'r';
            break;
    }
}

function keyupHandler(event){
    if(game == undefined || game.pause) return;
    event = event || window.event;
    if(event.keyCode == 37 || event.keyCode == 65){
        if(cannon.dir == 'l'){
            cannon.dir = 's';
        }
    } else if (event.keyCode == 39 || event.keyCode == 68){
        if(cannon.dir == 'r'){
            cannon.dir = 's';
        }
    }
}

function startGame(){
    cleanUp();
    closeAllMenu();
    cannon = new Cannon(30+3*user.moveLvl, 1000/(4+user.shootLvl));
    bm = new BallMaster(3, 5);
    cd = new CollisionDetector(cannon, bm);
    cd.start();
    cannon.start();
    game.pause = false;
    game.lost = false;

    game.spawnerInterval = setInterval(function(){
        if(game.pause) return;
        spawnerFunction();
    }, 1000 );
}

function cleanUp(){
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
    user.points = 0;
    pointsElem.nodeValue = 0;
}

function spawnerFunction(){
    randomSize = Math.floor(Math.random()*3+1);
    //starts at 15, then max will increase by 1hit/size every 50pts (non discrete)10
    hits = Math.floor(Math.random()*(user.points*randomSize/50 + 15)+1);
    bm.spawn(randomSize,
            Math.random()*15 + 5,
            hits);
}

function addPoints(value){
    user.points += value;
    pointsElem.nodeValue = user.points;
}

function addMoney(value){
    user.money += value;
    moneyElem.nodeValue = user.money;
}

function lost(fromPause){
    game.pause = true;
    game.lost = true;
    if(user.points > user.highscore){
        user.highscore = user.points;
        setHighscore();
    }
    if(fromPause != true)
        lostMessage.classList.add('down');
    ajaxUpdate('money', user.money);
}

function pause(){
    if(game.lost == undefined || game.lost) return;
    if(game.pause){
        pauseMessage.classList.remove('down');
        pauseBtn.classList.remove("play");
        //pauseBtn.innerHTML = '&#9612;&#9612';
    } else {
        pauseMessage.classList.add('down');
        pauseBtn.classList.add("play");
        //pauseBtn.innerHTML = "&#9658;";
    }
    game.pause = !game.pause;
}

function mobileMove(dir){
    if(!game.pause && !game.lost){
        cannon.dir = dir;
    }
}

function closeAllMenu(){
    pauseMessage.classList.remove('down');
    lostMessage.classList.remove('down');
    intro.classList.remove('down');
    powerUpMsg.classList.remove('down');
    loginMsg.classList.remove('down');
    docMsg.classList.remove('down');
}

function backToMenu(){
    //calling pause resumes the game for an instant setting
    //all the variables as they should be
    pause();
    lost(true);
    showIntro();
}
function showIntro(){
    closeAllMenu();
    intro.classList.add('down');
}

function showPowerup(){
    closeAllMenu();
    updatePowerup();
    powerUpMsg.classList.add('down');
}

function showLogin(){
    closeAllMenu();
    loginMsg.classList.add('down');
}

function showDoc(){
    closeAllMenu();
    docMsg.classList.add('down');
}

function updatePowerup(){
    moveLvlElem.textContent = user.moveLvl;
    shootLvlElem.textContent = user.shootLvl;
    moveCost = cost(user.moveLvl);
    shootCost = cost(user.shootLvl);
    powerMoveCostElem.childNodes[2].nodeValue = moveCost;
    powerShootCostElem.childNodes[2].nodeValue = shootCost;
    powerMoveCostElem.disabled = (moveCost > user.money);
    powerShootCostElem.disabled = (shootCost > user.money);
}

function cost(lvl){
    return Math.floor(100*Math.pow(1.15, lvl-1));
}

function setHighscore(){
    highscoreElem.textContent = user.highscore;
    ajaxUpdate('highscore', user.highscore);
}

function powerShoot(){
    addMoney(-cost(user.shootLvl));
    user.shootLvl += 1;
    updatePowerup();
    ajaxUpdate('shoot_lvl', user.shootLvl);
    ajaxUpdate('money', user.money);
}

function powerMove(){
    addMoney(-cost(user.moveLvl));
    user.moveLvl += 1;
    updatePowerup();
    ajaxUpdate('move_lvl', user.moveLvl);
    ajaxUpdate('money', user.money);
}