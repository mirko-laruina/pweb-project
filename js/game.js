var cannon = {}
var wrapper;

function init(){
    wrapper = {
        elem: document.getElementById("game-wrapper"),
        samples: 10,
        pos_factor: 1
    }
    cannon.initCannon();
}

cannon.initCannon = function(){
    cannon.elem = document.getElementById("cannon");
    cannon.max_pos = 100*cannon.elem.offsetLeft/wrapper.elem.clientWidth;
    cannon.model_pos = cannon.max_pos/2
    cannon.elem.style.margin = '0 0' + cannon.model_pos +'% 0';
    //cannon.style.transition = "all 0.2s linear 0s"
}

function resize(){
    cannon.elem.style.transition = "";
    cannon.elem.style.margin = '0 0 0 0';
    cannon.initCannon();
}

cannon.move = function(dir){

    cannon.view_pos = cannon.model_pos;
    
    if(dir == 'l'){
        cannon.model_pos += wrapper.pos_factor;
        if(cannon.model_pos > cannon.max_pos){
            cannon.model_pos = cannon.max_pos;
        }
    } else {
        cannon.model_pos -= wrapper.pos_factor;
        if(cannon.model_pos < 0){
            cannon.model_pos = 0;
        }
    }

    var dx_pos = (cannon.model_pos-cannon.view_pos)/wrapper.samples;
    var intervalId = setInterval(movedx, 5);
    var samples = wrapper.samples;
    function movedx(){
        if(--(samples) == 0){
            clearInterval(intervalId);
        }
        cannon.view_pos += dx_pos;
        cannon.elem.style.margin = '0 0' + cannon.view_pos +'% 0';
    }
}

function keydownHandler(event){
    //Per compatibilita': Chrome e IE hanno event globale
    //Firefox necessita che glielo si passi come argomento
    event = event || window.event;
    switch(event.key){
        case "ArrowLeft":
            cannon.move('l');
            break;
        case "ArrowRight":
            cannon.move('r');
            break;
    }
}