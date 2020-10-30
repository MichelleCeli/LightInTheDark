let app;
        let player;
        var box;
        let ground;
        let platform;
        let physicsObjects = [];
        let keys = {};
        
        window.onload = function(){
            var Engine = Matter.Engine,
                World = Matter.World,
                Bodies = Matter.Bodies;
                Body = Matter.Body;

            // create an engine
            var engine = Engine.create();
            
            //create body and ground
            box = Bodies.rectangle(400,200, 40,40);
            var groundBody = Bodies.rectangle(0,500,1000,30, {isStatic: true});
            var platformBody = Bodies.rectangle(50, 400, 200, 30, {isStatic: true});
            
            World.add(engine.world, [box,groundBody,platformBody]);
            
            app = new PIXI.Application({width: 800,
                height: 600, backgroundColor: 0x1099bb});
            //document.body.appendChild(app.view);
            document.querySelector(".scene").appendChild(app.view);
            
           player = new PIXI.Sprite.from('images/player.png');
            player.anchor.set(0.5);
            player.position;

            ground = new PIXI.Sprite.from('images/ground.png');
            ground.anchor.set(0.5);
            ground.position;

            platform = new PIXI.Sprite.from('images/platform.png');
            platform.anchor.set(0.5);
            platform.position;
            
            
            app.stage.addChild(player);
            app.stage.addChild(ground);
            app.stage.addChild(platform);
            
            physicsObjects.push([
                box,
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
        
        function keysDown(e){
            console.log(e.keyCode);
            keys[e.keyCode] = true;
        }
        
        function keysUp(e){
            console.log(e.keyCode);
            keys[e.keyCode] = false;
        }
        
        function gameLoop(){
            if(keys["68"]){
                Body.translate(box, {x: 1, y: 0});
            }
            if(keys["65"]){
                Body.translate(box, {x: -1, y: 0});
            }
            if(keys["32"]){
                Body.translate(box, {x: 0, y: -2});
            }
        }
