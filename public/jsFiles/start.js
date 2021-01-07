import GameScene from './gameScene.js';

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },

        }
    },
    scene: GameScene
};

var game = new Phaser.Game(config);
        
            function preload ()
            {
                this.load.image('bgBackSprite', './img/assets/background/background_1960x1080.png');
                this.load.image('bgBackTreeSprite', './img/assets/background/trees_bg_1960x1080.png');
                this.load.image('bgMiddleTreeSprite', './img/assets/background/trees_fg_1960x1080.png');
                this.load.image('bgFrontSprite','./img/assets/background/front_1960x1080.png'); 
                this.load.image('platform', './img/platform.png');
                this.load.spritesheet('player', './img/assets/player.png', { frameWidth: 80, frameHeight: 75 });
                this.load.image('barBg', './img/healthbar.png');
                this.load.image('healthbar', './img/healthbar_red.png');
                this.load.image('lightbar', './img/lightbar_yellow.png');
                this.load.spritesheet('ground', './img/ground.png', {frameWidth: 400, frameHeight: 100});
                this.load.image('thorns', './img/thorns.png');
                this.load.image('crystal', './img/crystal_small.png');





                //tilemap
                this.load.image('sprites', './img/assets/maps/test.png');

                this.load.tilemapTiledJSON("mappy", "./img/assets/maps/Test.json");


             /*   this.load.atlas("gameWorld", "./img/assets/spritesLITD.png", "./img/assets/spritesLITD.json");*/
                this.cursor = this.input.keyboard.createCursorKeys();
            }

            let gameOptions = {
                initialTime: 60
            }
        
            function create ()
            {
                const width = this.scale.width;
                const height = this.scale.height;

                //background
              /*  this.add.image(width*0.5, height*0.5, 'bgBackSprite')
                        .setScrollFactor(0);

                createAligned(this, 3, 'bgBackTreeSprite', 0.15);
                createAligned(this, 3, 'bgMiddleTreeSprite', 0.3);
                createAligned(this, 3, 'bgFrontSprite', 0.5);*/



                //healthbar, lightbar
                this.timeLeft = gameOptions.initialTime;

                let healthbarContainer = this.add.sprite(150, 50, 'barBg');
                healthbarContainer.setScale(0.2);
                let healthbar = this.add.sprite(healthbarContainer.x, healthbarContainer.y, 'healthbar');
                healthbar.setScale(0.2);
                this.healthMask = this.add.sprite(healthbar.x, healthbar.y, 'healthbar');
                this.healthMask.setScale(0.2);
                this.healthMask.visible = false;

                let lightbarContainer = this.add.sprite(150, 100, 'barBg');
                lightbarContainer.setScale(0.2);
                let lightbar = this.add.sprite(lightbarContainer.x, lightbarContainer.y, 'lightbar');
                lightbar.setScale(0.2);
                this.lightMask = this.add.sprite(lightbar.x, lightbar.y, 'lightbar');
                this.lightMask.setScale(0.2);
                this.lightMask.visible = false;

                healthbar.mask = new Phaser.Display.Masks.BitmapMask(this, this.healthMask);
                lightbar.mask = new Phaser.Display.Masks.BitmapMask(this, this.lightMask);

                /* this.gameTimer = this.time.addEvent({
                        delay: 1000,
                        callback: function(){
                            this.timeLeft --;
             
                            // dividing enery bar width by the number of seconds gives us the amount
                            // of pixels we need to move the energy bar each second
                            let stepWidth = this.healthMask.displayWidth / gameOptions.initialTime;
             
                            // moving the mask
                            this.healthMask.x -= stepWidth;
                            if(this.timeLeft == 0){
                                //this.scene.start("PlayGame")
                            }
                        },
                        callbackScope: this,
                        loop: true
                    }); */


              /*  this.crystal = this.add.sprite(200, 200, "gameWorld", "crystal_small.png");

                var frameNames = this.textures.get('gameWorld').getFrameNames();
                console.log(frameNames);*/

               /* crystals = this.physics.add.staticGroup();
                crystals.create(400, 520, 'crystal');*/

                //platforms

             /*   platforms = this.physics.add.staticGroup();
                platforms.create(400, 568, 'platform');
                platforms.create(600, 400, 'platform');
                platforms.create(50, 250, 'platform');
                platforms.create(750, 220, 'platform');*/
               /* platforms.create(100, height, 'platform');*/

             /*   this.physics.world.setBoundsCollision(true, false, true, true);*/


                this.player = this.physics.add.sprite(200, 450, 'player');

                    this.player.setBounce(0.05);
                    this.player.setCollideWorldBounds(true);
                /*    this.physics.add.collider(player, platforms);*/

                this.anims.create({
                    key: 'left',
                    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
                    frameRate: 8,
                    repeat: -1
                });

                this.anims.create({
                    key: 'turn',
                    frames: [ { key: 'player', frame: 5 } ],
                    frameRate: 20
                });

                this.anims.create({
                    key: 'right',
                    frames: this.anims.generateFrameNumbers('player', { start: 6, end: 9 }),
                    frameRate: 8,
                    repeat: -1
                });



                this.cameras.main.setBounds(0,0, width * 3, height);





                //tilemap

               /* let mappy = this.add.tilemap("mappy");*/
/*
                const mappy = this.make.tilemap({ key: "mappy"})

                const sprites = mappy.addTilesetImage("test", "sprites");

                //layer
                const layer = mappy.createStaticLayer("layer", sprites, 0, 0);

                //collisions

                this.physics.add.collider(player, layer);
                layer.setCollisionByProperty({collides:true});*/






                //ground

               /* ground = this.physics.add.staticGroup({
                    key: 'ground',
                    repeat: 0,
                    setXY: { x: 400, y: height-50, stepX: 70 }
                });
                this.physics.add.collider(player, ground);

                thorns = this.physics.add.staticGroup();
                platforms.create(800, 568, 'thorns');
                this.physics.world.setBoundsCollision(true, false, true, true);*/



                /* const reveal = this.add.image(width*0.5, height*0.5, 'bgBackSprite')
		this.cover = this.add.image(width*0.5, height*0.5, 'bgBackSprite')
                this.cover.setTint(0x004c99)
                
                const width = this.cover.width
		const height = this.cover.height

		const rt = this.make.renderTexture({
			width,
			height,
			add: false
		})

		const maskImage = this.make.image({
			x,
			y,
			key: rt.texture.key,
			add: false
		})

		this.cover.mask = new Phaser.Display.Masks.BitmapMask(this, maskImage)
		this.cover.mask.invertAlpha = true

                reveal.mask = new Phaser.Display.Masks.BitmapMask(this, maskImage)
                
                this.light = this.add.circle(0, 0, 30, 0x000000, 1)
                this.light.visible = false

                this.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this)
                
                this.renderTexture = rt */
            }        

            function update(){
                    const cam = this.cameras.main;
                    const speed = 1;
                    if(this.cursor.left.isDown){
                        cam.scrollX -= speed;
                        this.player.setVelocityX(-160);
                        this.player.anims.play('left', true);

                    }else if(this.cursor.right.isDown){
                        cam.scrollX += speed
                        this.player.setVelocityX(160);
                        this.player.anims.play('right', true);
                    }else{
                        this.player.setVelocityX(0);
                        this.player.anims.play('turn');
                    }

                    if (this.cursor.up.isDown && player.body.touching.down)
                    {
                            this.player.setVelocityY(-330);
                    }

                    this.lightMask.x -= 0.2;
            }

            const createAligned = (scene, count, texture, scrollFactor) => {
                    let x = scene.scale.width*0.5;
                for(let i = 0; i < count; ++i){
                        const m = scene.add.image(x, scene.scale.height *0.5, texture)
                                .setScrollFactor(scrollFactor)
                        
                        x += m.width
                }
            }

            /* handlePointerMove(pointer)
	{
		const x = pointer.x - this.cover.x + this.cover.width * 0.5
		const y = pointer.y - this.cover.y + this.cover.height * 0.5

		this.renderTexture.clear()
		this.renderTexture.draw(this.light, x, y)
	} */