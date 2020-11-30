let keys = {};
window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

function keysDown(e) {
    keys[e.keyCode] = true;
}

function keysUp(e) {
    keys[e.keyCode] = false;
}  

function playerMovement(){

    if(lightBar.outer.width > 1){
        lightBar.outer.width -= 0.05;  
    }

    if (keys["68"]) {
        Body.translate(playerBody, { x: 1, y: 0 });
       playerMoveToRight();
    }
    if (keys["65"]) {
        Body.translate(playerBody, { x: -1, y: 0 });
        playerMoveToLeft();
    }


    if (keys["32"]) {
        Body.translate(playerBody, { x: 0, y: -2 });
        if(healthBar.outer.width > 1){
        healthBar.outer.width -= 1;  
        console.log(healthBar.outer.radius); 
        //healthBar.outer.radius = 10;
        }
    }
    if(playerBody.velocity.y == 0){
        playerPause();
    }

    if (hitTestRectangle(playerSprite, firefly) && firefly.visible == true && lightBar.outer.width < 300) {
        if(lightBar.outer.width+20 > 300){
            lightBar.outer.width = 300; 
        }else{
            lightBar.outer.width += 20; 
        }  
        firefly.visible = false;
    }
    if (hitTestRectangle(playerSprite, crystal) && crystal.visible == true && healthBar.outer.width < 300) {
        if(healthBar.outer.width+20 > 300){
            healthBar.outer.width = 300; 
        }else{
            healthBar.outer.width += 20; 
        }
        crystal.visible = false;
    }
}  