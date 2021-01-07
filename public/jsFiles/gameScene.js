export default class GameScene extends Phaser.Scene{

    preload ()
    {
        this.load.image('bgBackSprite', './img/assets/background/background_1960x1080.png');
        this.load.image('bgBackTreeSprite', './img/assets/background/trees_bg_1960x1080.png');
        this.load.image('bgMiddleTreeSprite', './img/assets/background/trees_fg_1960x1080.png');
        this.load.image('bgFrontSprite', './img/assets/background/front_1960x1080.png');
        this.load.image('platform', './img/platt.png');
        this.load.image('player', './img/player.png');
        this.load.image('barBg', './img/healthbar.png');
        this.load.image('healthbar', './img/healthbar_red.png');
        this.load.image('lightbar', './img/lightbar_yellow.png');

        this.load.image('tiles', './img/0x72-industrial-tileset-32px-extruded.png');
        this.load.image('marioTiles', './img/super-mario.png');

        this.cursor = this.input.keyboard.createCursorKeys();
    }

    

    create ()
    {
        const width = this.scale.width;
        const height = this.scale.height;

        //background
        this.add.image(width*0.5, height*0.5, 'bgBackSprite')
                .setScrollFactor(0);

        createAligned(this, 3, 'bgBackTreeSprite', 0.15);
        createAligned(this, 3, 'bgMiddleTreeSprite', 0.3);
        createAligned(this, 3, 'bgFrontSprite', 0.5);

        let gameOptions = 60;

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

        //platforms
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'platform').setScale(2).refreshBody();
        platforms.create(600, 400, 'platform');
        platforms.create(50, 250, 'platform');
        platforms.create(750, 220, 'platform');
        platforms.create(100, height, 'platform');

        //test
        /* var level = [
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0, 0, 1, 2, 3],
            [  0,  1,  2,  3,  0,  0,  0,  1,  2,  3,  0 ],
            [  0,  5,  6,  7,  0,  0,  0,  5,  6,  7,  0 ],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
            [  0,  0,  0, 14, 13, 14,  0,  0,  0,  0,  0 ],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
            [  0,  0, 14, 14, 14, 14, 14,  0,  0,  0, 15 ],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0, 15, 15 ],
            [ 35, 36, 37,  0,  0,  0,  0,  0, 15, 15, 15 ],
            [ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0],
            [0, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39]
          ]
      
          // When loading from an array, make sure to specify the tileWidth and tileHeight
          this.map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
          this.tiles = this.map.addTilesetImage('marioTiles');
          this.layer = this.map.createLayer('layer', this.tiles, 0, 0);
          this.layer.setCollisionByProperty({ collides: true }); */

        this.physics.world.setBoundsCollision(true, false, true, true);
        

        this.player = this.physics.add.sprite(200, 450, 'player');

            this.player.setBounce(0.2);
            this.player.setCollideWorldBounds(true);
            this.physics.add.collider(this.player, platforms);
            //this.physics.add.collider(this.player, this.layer, () => console.debug("collide"));

        this.cameras.main.setBounds(0,0, width * 3, height);

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

    update(){
        const cam = this.cameras.main;
        const speed = 1;
        if(this.cursor.left.isDown){
            cam.scrollX -= speed;
            this.player.setVelocityX(-160);

        }else if(this.cursor.right.isDown){
            cam.scrollX += speed
            this.player.setVelocityX(160);
        }else{
            this.player.setVelocityX(0);
        }

        if (this.cursor.up.isDown && this.player.body.touching.down)
        {
                this.player.setVelocityY(-330);
        }

        this.lightMask.x -= 0.2;
}



/* handlePointerMove(pointer)
{
const x = pointer.x - this.cover.x + this.cover.width * 0.5
const y = pointer.y - this.cover.y + this.cover.height * 0.5

this.renderTexture.clear()
this.renderTexture.draw(this.light, x, y)
} */
}

const createAligned = (scene, count, texture, scrollFactor) => {
    let x = scene.scale.width*0.5;
for(let i = 0; i < count; ++i){
        const m = scene.add.image(x, scene.scale.height *0.5, texture)
                .setScrollFactor(scrollFactor)
        
        x += m.width
}
}