//let keys = {};

window.onload = function () {

    //window.addEventListener("keydown", keysDown);
    //window.addEventListener("keyup", keysUp);

     physicsObjects.push([
        playerBody,
        player,
    ]);

    physicsObjects.push([
        groundBody,
        ground,
    ]);

    physicsObjects.push([
        platformBody,
        platform,
    ]); 


    app.ticker.add(() => {
        physicsObjects.forEach(element => {
            playerMovement();
            let body = element[0];
            let sprite = element[1];
            sprite.x = body.position.x;
            sprite.y = body.position.y;
            body.angle = 0;
        });
        
    });

    Engine.run(engine);
}

/* function keysDown(e) {
    keys[e.keyCode] = true;
}

function keysUp(e) {
    keys[e.keyCode] = false;
}    

function gameLoop() {
    if(lightBar.outer.width > 1){
        lightBar.outer.width -= 0.05;  
    }

    if (keys["68"]) {
        Body.translate(playerBody, { x: 1, y: 0 });
    }
    if (keys["65"]) {
        Body.translate(playerBody, { x: -1, y: 0 });
    }
    if (keys["32"]) {
        Body.translate(playerBody, { x: 0, y: -2 });
        if(healthBar.outer.width > 1){
        healthBar.outer.width -= 1;  
        console.log(healthBar.outer.radius); 
        //healthBar.outer.radius = 10;
        }
    }

    if (hitTestRectangle(player, firefly) && firefly.visible == true) {
        lightBar.outer.width += 20; 
        firefly.visible = false;
    }
    if (hitTestRectangle(player, crystal) && crystal.visible == true) {
        healthBar.outer.width += 20; 
        crystal.visible = false;
    }

} */