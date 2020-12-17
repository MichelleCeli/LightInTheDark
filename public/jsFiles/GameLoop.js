//let keys = {};
let pauseBtn = document.getElementById('pause-btn');
let pauseModal = document.getElementById('pause-modal');
let resumeGame = document.getElementById('resume-game');
let ticker = PIXI.Ticker.shared;

window.onload = function () {

    //window.addEventListener("keydown", keysDown);
    //window.addEventListener("keyup", keysUp);

     physicsObjects.push([
        playerBody,
        playerSprite,
    ]);

    physicsObjects.push([
        groundBody,
        ground,
    ]);

    physicsObjects.push([
        platformBody,
        platform,
    ]); 


    clickPause();

    ticker.add(() => {
        // ÄNDERUNG 27.11 - Alina
        // Hintergrundbild wird immer wieder neu geladen und Schnelligkeit wird angepasst
         updateBg();
        
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


function toggleModal() {
    if(pauseModal.style.display === 'none') {
        pauseModal.style.display = 'block';
    } else {
        pauseModal.style.display = 'none';
    }
}

// Pause Method
function clickPause () {
    pauseBtn.addEventListener('click', () => {
        this.toggleModal();
        console.log('it works, I guess?');
        ticker.stop();
    })
    resumeGame.addEventListener('click', () => {
            this.toggleModal();
            ticker.start();
    })
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