var playerBody;
var ground;
var platform;
var physicsObjects = [];

var World = Matter.World,
        Bodies = Matter.Bodies;
        Body = Matter.Body;

    //create body and ground
    playerBody = Bodies.rectangle(400, 200, 40, 40);
    var groundBody = Bodies.rectangle(0, 500, 1000, 30, { isStatic: true });
    var platformBody = Bodies.rectangle(50, 400, 200, 30, { isStatic: true });

    World.add(engine.world, [playerBody, groundBody, platformBody]);

    

    //Ground sprite
    ground = PIXI.Sprite.from('./img/ground.png');
    ground.anchor.set(0.5);
    ground.position;

    //Platform sprite
    platform = PIXI.Sprite.from('./img/platform.png');
    platform.anchor.set(0.5);
    platform.position;

    app.stage.addChild(ground,platform);