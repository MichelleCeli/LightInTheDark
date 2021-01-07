export default class GameScene extends Phaser.Scene{

    preload ()
    {
        this.load.image('bgBackSprite', './img/assets/background/background_1960x1080.png');
        this.load.image('bgBackTreeSprite', './img/assets/background/trees_bg_1960x1080.png');
        this.load.image('bgMiddleTreeSprite', './img/assets/background/trees_fg_1960x1080.png');
        this.load.image('bgFrontSprite', './img/assets/background/front_1960x1080.png');
        this.load.image('platform', './img/platform.png');
        this.load.spritesheet('player', './img/assets/player.png',  { frameWidth: 80, frameHeight: 75 });
        this.load.image('barBg', './img/healthbar.png');
        this.load.image('healthbar', './img/healthbar_red.png');
        this.load.image('lightbar', './img/lightbar_yellow.png');

        this.load.image('tiles', './img/0x72-industrial-tileset-32px-extruded.png');
        this.load.image('marioTiles', './img/super-mario.png');

        this.load.image('pause-btn', './img/assets/pause-btn.png');

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
        this.healthMask = this.add.sprite(healthbar.x, healthbar.y, 'healthbar');
        this.healthMask.setScale(0.2);
        this.healthMask.setScrollFactor(0);
        this.healthMask.visible = false;
        

        let lightbarContainer = this.add.sprite(150, 100, 'barBg');
        lightbarContainer.setScale(0.2);
        lightbarContainer.setScrollFactor(0);
        let lightbar = this.add.sprite(lightbarContainer.x, lightbarContainer.y, 'lightbar');
        lightbar.setScale(0.2);
        lightbar.setScrollFactor(0);
        this.lightMask = this.add.sprite(lightbar.x, lightbar.y, 'lightbar');
        this.lightMask.setScale(0.2);
        this.lightMask.setScrollFactor(0);
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

        //platforms
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'platform').setScale(2).refreshBody();
        platforms.create(600, 400, 'platform');
        platforms.create(50, 250, 'platform');
        platforms.create(750, 220, 'platform');
        platforms.create(100, height, 'platform');


        this.physics.world.setBoundsCollision(true, false, true, true);
        

        this.player = this.physics.add.sprite(200, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);

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

        this.cameras.main.setBounds(0,0, width * 3, height);
        
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

        if (this.cursor.up.isDown && this.player.body.touching.down)
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


// Alina 07.01.2020
// Versuch den Pause Button einzufügen

/*
function createPauseScreen() {
    //transparent rect
    this.rect = this.add.graphics({ x: 0, y: 0 });
    this.rect.fillStyle('0x000000', 0.3);
    this.rect.fillRect(0, 0, this.CONFIG.width, this.CONFIG.height);
    this.rect.setDepth(this.DEPTH.ui);
    this.rect.setScrollFactor(0);
    
    //Pause Text
    this.txt_pause = new Text (
        this, this.CONFIG.centerX, this.CONFIG.centerY -32,
        'Pause', 'title'
    );
    this.txt_pause.setDepth(this.DEPTH.ui);
    this.txt_pause.setScrollFactor(0);

    // Hiding at start
    this.togglePauseScreen(false);
}

function togglePauseScreen(isVisible) {
    this.rect.setVisible(isVisible);
    this.txt_pause.setVisible(isVisible);
}
*/

const createAligned = (scene, count, texture, scrollFactor) => {
    let x = scene.scale.width*0.5;
for(let i = 0; i < count; ++i){
        const m = scene.add.image(x, scene.scale.height *0.5, texture)
                .setScrollFactor(scrollFactor)
        
        x += m.width
    }
}

}
