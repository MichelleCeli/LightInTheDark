let player;
let direction = '';

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
        this.load.image('crystal', './img/crystal_small.png');
        this.load.image('enemy', './img/enemy.png');

        // tilemap
        this.load.image("basement", "./img/assets/maps/basement.png");
        this.load.tilemapTiledJSON("map", "./img/assets/maps/map.json");

        this.load.image('pause-btn', './img/assets/pause-btn.png');

        this.cursor = this.input.keyboard.createCursorKeys();
    }

    create ()
    {
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
        healthbarContainer.setDepth(2);
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
        lightbarContainer.setDepth(2);
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
  

        // Kristalle einfügen

        let crystal = this.add.sprite('crystal');
        crystal.setScrollFactor(1);

        crystal = this.physics.add.group({
            key: 'crystal',
            repeat: 3,
            setXY: { x: 750, y: 0, stepX: Phaser.Math.FloatBetween(300, 800) }
        });
        
        crystal.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.4));
        });
        

        // Gegner einfügen

        let enemy = this.add.sprite('enemy');
        enemy.setScrollFactor(1);

        enemy = this.physics.add.group({
            key: 'enemy',
            repeat: 5,
            setXY: { x: 400, y: 0, stepX: Phaser.Math.FloatBetween(300, width) },
        });

        enemy.children.iterate(function (child) {
            child.setBounce(0.4);
            child.setVelocity(Phaser.Math.Between(-10, 10), 0);
        })


//////////////////////////////

        this.physics.world.setBoundsCollision(true, false, true, true);

        player = this.physics.add.sprite(200, 450, 'player');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: -1

        });

        this.anims.create({
            key: 'turnFromRight',
            frames: [ { key: 'player', frame: 5 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'turnFromLeft',
            frames: [ { key: 'player', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 9 }),
            frameRate: 8,
            repeat: -1,
        });

        this.spotlight = this.make.graphics();
        this.spotlight.fillStyle(0xfffffff);
        this.spotlight.fillCircle(0, 0, 128);

        const mask = this.spotlight.createGeometryMask();
        mask.setInvertAlpha(true);
        cover.setMask(mask);
        cover.setDepth(1);

        this.cameras.main.setBounds(0,0, width * 3, height);


        // tilemap

        const map = this.make.tilemap({ key: "map" });
        


        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("basement", "basement"); //.png???

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const mapLayer = map.createStaticLayer("mapLayer", tileset, 0, height-1000);

        // set collision
        mapLayer.setCollisionByProperty({collides : true});
        this.physics.add.collider(player, mapLayer);
        this.physics.add.collider(crystal, mapLayer);
        this.physics.add.collider(enemy, mapLayer);
        this.physics.add.collider(player, enemy, hitEnemy, null, this);

        // Check overlap between Crystal and Player
        this.physics.add.overlap(player, crystal, collectCrystal, null, this);
        
        function collectCrystal (player, crystal) {
            crystal.disableBody(true, true);
        }

        // Enemy Collision
        function hitEnemy (player, enemy) {
            this.physics.pause();
            player.setTint(0xff0000);
            gameOver = true;
        }

        // Kamera Einstellungen
        const camera = this.cameras.main;
        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, height-1000);

/*
        function pauseGame (player) {
            player.disableBody(true);
            this.physics.pause();
            gameOver = true;
        }
*/
    }


    update(){
     /*   this.player.body.setVelocity(0); Fix bugs??? */

        if(this.cursor.left.isDown){
            player.setVelocityX(-160);
            player.anims.play('left', true);
            direction = 'left';

        }else if(this.cursor.right.isDown){
            player.setVelocityX(160);
            player.anims.play('right', true);
            direction = 'right';

        }else{
            player.setVelocityX(0);
            if(direction === 'right') {
                player.anims.play('turnFromRight');
            } else {
                player.anims.play('turnFromLeft');
            }
        }

        if (this.cursor.up.isDown && player.body.onFloor() /*this.player.body.touching.down*/)
        {
                player.setVelocityY(-380);
        }

        this.spotlight.setPosition(player.x, player.y);
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


let pauseBtn = document.getElementById("pause-btn");
let pauseModal = document.getElementById("pause-modal");
let resumeGame = document.getElementById("resume-game");
let restartGame = document.getElementById("restart-game");

function clickPause() {
  pauseBtn.addEventListener("click", () => {
    toggleModal();
    player.disableBody(true);
    console.log("it works, I guess?");
  });

  function toggleModal() {
    if (pauseModal.style.display === "none") {
      pauseModal.style.display = "block";
      pauseBtn.style.display = "none";
    } else {
      pauseModal.style.display = "none";
    }
  }

  resumeGame.addEventListener("click", () => {
    toggleModal();
    console.log("Ich bin hier....");
    pauseBtn.style.display = "block";
    player.disableBody(false);
  });

  restartGame.addEventListener("click", () => {
    location.reload();
  });
}


//Pause Button
pauseModal.style.display = "none";
clickPause();