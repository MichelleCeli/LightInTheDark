export default class GameScene extends Phaser.Scene{



    preload ()
    {
        this.load.image('bgBackSprite', './img/assets/background/background_1960x1080.png');
        this.load.image('bgBackTreeSprite', './img/assets/background/trees_bg_1960x1080.png');
        this.load.image('bgMiddleTreeSprite', './img/assets/background/trees_fg_1960x1080.png');
        this.load.image('bgFrontSprite', './img/assets/background/front_1960x1080.png');
        this.load.spritesheet('player', './img/assets/player.png',  { frameWidth: 80, frameHeight: 75 });
        this.load.image('barBg', './img/healthbar.png');
        this.load.image('healthbar', './img/healthbar_red.png');
        this.load.image('lightbar', './img/lightbar_yellow.png');

        // tilemap
        this.load.image("basement", "./img/assets/maps/basement.png");
        this.load.tilemapTiledJSON("map", "./img/assets/maps/map.json");

        this.cursor = this.input.keyboard.createCursorKeys();



    }

    

    create ()
    {
        console.log("hallo");
        const width = this.scale.width;
        const height = this.scale.height;

        //background
        const bg1 = this.add.image(width*0.5, height*0.5, 'bgBackSprite')
                .setScrollFactor(0);

        const bg2 = createAligned(this, 3, 'bgBackTreeSprite', 0.15);
        const bg3 = createAligned(this, 3, 'bgMiddleTreeSprite', 0.3);
        const bg4 = createAligned(this, 3, 'bgFrontSprite', 0.5);

        let gameOptions = 60;

         const cover = this.add.graphics();
        cover.fillStyle(0x000000, 0.8);
        cover.fillRect(0,0, width, height);
        cover.setScrollFactor(0);

        //healthbar, lightbar
        this.timeLeft = gameOptions.initialTime;

        let healthbarContainer = this.add.sprite(150, 50, 'barBg');
        healthbarContainer.setScale(0.2);
        healthbarContainer.setScrollFactor(0);
        let healthbar = this.add.sprite(healthbarContainer.x, healthbarContainer.y, 'healthbar');
        healthbar.setScale(0.2);
        healthbar.setScrollFactor(0);
        healthbar.setDepth(2);
        this.healthMask = this.add.sprite(healthbar.x, healthbar.y, 'healthbar');
        this.healthMask.setScale(0.2);
        this.healthMask.setScrollFactor(0);
        this.healthMask.setDepth(2);
        this.healthMask.visible = false;


        let lightbarContainer = this.add.sprite(150, 100, 'barBg');
        lightbarContainer.setScale(0.2);
        lightbarContainer.setScrollFactor(0);
        let lightbar = this.add.sprite(lightbarContainer.x, lightbarContainer.y, 'lightbar');
        lightbar.setScale(0.2);
        lightbar.setScrollFactor(0);
        lightbar.setDepth(2);
        this.lightMask = this.add.sprite(lightbar.x, lightbar.y, 'lightbar');
        this.lightMask.setScale(0.2);
        this.lightMask.setScrollFactor(0);
        this.lightMask.setDepth(2);
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


        this.physics.world.setBoundsCollision(true, false, true, true);


        this.player = this.physics.add.sprite(200, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

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

        this.spotlight = this.make.graphics();
        this.spotlight.fillStyle(0xfffffff);
        this.spotlight.fillCircle(0, 0, 128);

        const mask = this.spotlight.createGeometryMask();
        mask.setInvertAlpha(true);
        cover.setMask(mask);
        cover.setDepth(1);

        this.cameras.main.setBounds(0,0, width * 3, height);





        /* crystals = this.physics.add.staticGroup();
         crystals.create(400, 520, 'crystal');*/

        // tilemap

        const map = this.make.tilemap({ key: "map" });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("basement", "basement"); //.png???

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const mapLayer = map.createStaticLayer("mapLayer", tileset, 0, height-1000);

        // set collision
        mapLayer.setCollisionByProperty({collides : true});
        this.physics.add.collider(this.player, mapLayer);
        
    }        

    update(){
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

        if (this.cursor.up.isDown && this.player.body.onFloor() /*this.player.body.touching.down*/)
        {
                this.player.setVelocityY(-330);
        }

        this.spotlight.setPosition(this.player.x, this.player.y);
        if(this.spotlight.scale > 0.4){
             this.spotlight.scale -= 0.0008;
        }
        this.lightMask.x -= 0.2;
}

}

const createAligned = (scene, count, texture, scrollFactor) => {
    let x = scene.scale.width*0.5;
for(let i = 0; i < count; ++i){
        const m = scene.add.image(x, scene.scale.height *0.5, texture)
                .setScrollFactor(scrollFactor)
        
        x += m.width
}
}
