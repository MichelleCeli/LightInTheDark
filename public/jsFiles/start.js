var player;
var playerSprite;
var fireflySprite;
var crystalSprite;

// Änderungen Alina
// Laden des Hintergrundes
var bgBack;
var bgBackTree;
var bgMiddleTree;
var bgFront;


        var Engine = Matter.Engine;
        var engine = Engine.create();
        //const app = new PIXI.Application({autoResize: true, resolution: devicePixelRatio, anitalias: true, backgroundColor: 0x1099bb});
        const app = new PIXI.Application({view: document.getElementById('canvas'), forceCanvas: true, autoResize: true, backgroundColor: 0xFFFFFF});
        //document.body.appendChild(app.view);

        const rect = new PIXI.Graphics()
  
        // Add it to the stage
        app.stage.addChild(rect);

        // Listen for window resize events
        window.addEventListener('resize', resize);

        // Resize function window
        function resize() {
	      // Resize the renderer
	      app.renderer.resize(window.innerWidth, window.innerHeight);
  
        // You can use the 'screen' property as the renderer visible
        // area, this is more useful than view.width/height because
        // it handles resolution
        rect.position.set(app.screen.width, app.screen.height);
        }

        

        resize();
        
        
        
        /* const loader = PIXI.Loader.shared;
        const resources = PIXI.Loader.shared.resources;
        loader.add("./img/player.png")
                .add("./img/crystal.png")
                .add("./img/firefly.png")
                .load(setup());
        
        function setup() {

                playerSprite = new PIXI.Sprite(resources["./img/player.png"].texture);
                crystalSprite = new PIXI.Sprite(resources["./img/crystal.png"].texture);
                fireflySprite = new PIXI.Sprite(resources["./img/firefly.png"].texture);
        } */
        

        playerSprite = PIXI.Sprite.from('./img/player.png');
        crystalSprite = PIXI.Sprite.from('./img/crystal.png');
        fireflySprite = PIXI.Sprite.from('./img/firefly.png');
        
        
        bgBackSprite = PIXI.Sprite.from('./img/assets/background/background_1960x1080.png');
        bgBackTreeSprite = PIXI.Sprite.from('./img/assets/background/trees_bg_1960x1080.png');
        bgMiddleTreeSprite = PIXI.Sprite.from('./img/assets/background/trees_fg_1960x1080.png');
        bgFrontSprite = PIXI.Sprite.from('./img/assets/background/front_1960x1080.png');