var cannon;
var wrapper;
var max_pos;
var current_pos;
var samples, pos_factor;

function init(){
    wrapper = document.getElementById("game-wrapper");
    cannon = document.getElementById("cannon");
    initCannon();
    pos_factor = 0.01;
    samples = 100;
}

function initCannon(){
    max_pos = 100*cannon.offsetLeft/wrapper.clientWidth;
    current_pos = max_pos/2
    cannon.style.margin = '0 0' + current_pos +'% 0';
}

function resize(){
    cannon.style.margin = '0 0 0 0';
    initCannon();
}

function moveCannon(dir){
     /* per rendere smooth il movimento */
    for(var i = 0; i<samples; i++){
        if(dir == 'l'){
            current_pos += pos_factor;
            if(current_pos > max_pos){
                current_pos = max_pos;
            }
        } else {
            current_pos -= pos_factor;
            if(current_pos < 0){
                current_pos = 0;
            }
        }
        cannon.style.margin = '0 0' + current_pos +'% 0';
    }
}

function keydownHandler(){
    console.log(event.key);
    switch(event.key){
        case "ArrowLeft":
            moveCannon('l');
            break;
        case "ArrowRight":
            moveCannon('r');
            break;
    }
}