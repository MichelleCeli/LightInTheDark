//let player;
let playerBody;
let ground;
let platform;
let physicsObjects = [];
let keys = {};

window.onload = function () {
    var World = Matter.World,
        Bodies = Matter.Bodies;
        Body = Matter.Body;

    //create body and ground
    playerBody = Bodies.rectangle(400, 200, 40, 40);
    var groundBody = Bodies.rectangle(0, 500, 1000, 30, { isStatic: true });
    var platformBody = Bodies.rectangle(50, 400, 200, 30, { isStatic: true });

    World.add(engine.world, [playerBody, groundBody, platformBody]);

    //Player sprite
    player = PIXI.Sprite.from('img/player.png');
    player.anchor.set(0.5);
    player.position;

    //Ground sprite
    ground = PIXI.Sprite.from('img/ground.png');
    ground.anchor.set(0.5);
    ground.position;

    //Platform sprite
    platform = PIXI.Sprite.from('img/platform.png');
    platform.anchor.set(0.5);
    platform.position;

    app.stage.addChild(player,ground,platform);

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

    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);

    app.ticker.add(() => {
        physicsObjects.forEach(element => {
            gameLoop();
            let body = element[0];
            let sprite = element[1];
            sprite.x = body.position.x;
            sprite.y = body.position.y;
            body.angle = 0;
        });
    });

    Engine.run(engine);
}

function keysDown(e) {
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
}
