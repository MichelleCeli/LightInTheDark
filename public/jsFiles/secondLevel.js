import Player from "./player.js";
import Enemy from "./enemy.js";
import Crystal from "./crystal.js";
import Firefly from "./firefly.js";
import Arrow from "./Arrow.js";
import Healthbar from "./Healthbar.js";
import Lightbar from "./Lightbar.js";

let healthbar;
let lightbar;
let map2;
let ground;
let isPlayerDead;
let playerHealth;
let direction;
let enemy;
let firefly;
let crystal;
let switchScene;

let score = 0;
let gameLoaded = false;
let newPlayerPosX;
let newPlayerPosY;

// Pause Button Variablen
let pauseBtn = document.getElementById("pause-btn");
let counterAfterSwitchScene;

// Gameover Modal
let gameoverModal = document.getElementById("gameover-modal");
let restartGameOver = document.getElementById("restart-game-over");

let cover;
let coverfill;

let timerText;
let gamescene;

let shooting;
let justCreated;
let leftButtonPressed;
let arrowRot;
let arrow;

export default class SecondLevel extends Phaser.Scene{

    constructor() {
        super({key: 'SecondLevel'});

        this.level = 2;
    }
    

    preload () {
        //Hintergrund Bilder
        this.load.image('bgBackSpriteGreen', './img/assets/background/background_green_1960x1080.png');
        this.load.image('bgBackTreeSpriteGreen', './img/assets/background/trees_bg_green_1960x1080.png');
        this.load.image('bgMiddleTreeSpriteGreen', './img/assets/background/trees_fg_green_1960x1080.png');
        this.load.image('bgFrontSpriteGreen', './img/assets/background/front_green_1960x1080.png');

        // tilemap
        this.load.image("basement", "./img/assets/maps/basement.png");
        this.load.tilemapTiledJSON("map2", "./img/assets/maps/mapLevel2.json");

        //Health and Lightbar
        this.load.image('barBg', './img/healthbar.png');
        this.load.image('healthbar', './img/healthbar_red.png');
        this.load.image('lightbar', './img/lightbar_yellow.png');

        // door
        this.load.image("door2", "./img/assets/door.png");
    }

    create() {

        switchScene = this;
        gamescene = this.scene.get('GameScene');
        this.timer = 0;

        const width = this.scale.width;
        const height = this.scale.height;
        
        //background
        const bg1 = this.add.image(width*0.5, height*0.5, 'bgBackSpriteGreen')
        .setScrollFactor(0);

        const bg2 = createAligned(this, 3, 'bgBackTreeSpriteGreen', 0.15);
        const bg3 = createAligned(this, 3, 'bgMiddleTreeSpriteGreen', 0.3);
        const bg4 = createAligned(this, 3, 'bgFrontSpriteGreen', 0.5);

        let gameOptions = 60;

        // tilemap
        map2 = this.make.tilemap({ key: "map2" });
        const tileset = map2.addTilesetImage("basement", "basement");

        ground = map2.createLayer("ground", tileset, 0, 0);
        const thorns = map2.createLayer("thorns", tileset, 0, 0);
        const movementEnemies = map2.createLayer("movementEnemies", tileset, 0, 0);
        const doorSpawnPoint = map2.findObject("Objects", obj => obj.name === "Door Position");

        let door2 = this.physics.add.sprite(doorSpawnPoint.x, doorSpawnPoint.y, 'door2');
        door2.setSize(30, 90, true);
        door2.setScrollFactor(1);

        ground.setCollisionByProperty({collides : true});
        thorns.setCollisionByProperty({collides : true});
        movementEnemies.setCollisionByProperty({collides : true});

        this.physics.world.setBounds(0, 0, map2.width*10, height);
        this.physics.world.setBoundsCollision(true, true, false, false);

        // cover
        cover = this.add.rectangle(0,0, width*2, height*2, 0x000000);
        coverfill = 0.8;
        cover.setAlpha(coverfill);
        //cover.fillStyle(0x000000, coverfill);
        //cover.fillRect(0,0, width, height);
        cover.setScrollFactor(0);

        //Spotlight
        this.spotlight = this.make.graphics();
        this.spotlight.fillStyle(0xfffffff);
        this.spotlight.fillCircle(0, 0, 128);

        const mask = this.spotlight.createGeometryMask();
        mask.setInvertAlpha(true);
        cover.setMask(mask);
        cover.setDepth(1);


        //healthbar, lightbar
        this.timeLeft = gameOptions.initialTime;

        healthbar = new Healthbar(this, 150, 50, );
        lightbar = new Lightbar(this, 150, 100);



        // Player
        isPlayerDead = false;
        this.player = new Player(this, 40000, 500);
      //  this.player = new Player(this, 200, 500);
        playerHealth = 100;
        leftButtonPressed = false;



        enemy = new Enemy(this, ground);
        crystal = new Crystal(this, 8, 250, 600, 800);
        firefly = new Firefly(this, 20, 200, 300, 500);

        // set collision
        ground.setCollisionByProperty({collides : true});
        thorns.setCollisionByProperty({collides : true});
        movementEnemies.setCollisionByProperty({collides : true});

        this.physics.add.collider(door2, ground);
        //this.physics.add.collider(this.player.sprite, door2);//Ende
        this.physics.add.overlap(this.player.sprite, door2, endLevel, null, this);
        function endLevel() {
            gamescene.setNewHighscore();
            this.scene.stop();
        }
        this.physics.add.collider(this.player.sprite, ground);
        this.physics.add.collider(this.player.sprite, thorns, function(sprite, thorns){
            sprite.setVelocityY(-380);
            playerHealth -= 50;
            healthbar.updateHealthbar(playerHealth);
        });
        this.physics.add.collider(this.player.sprite, enemy.group, function(sprite) {
            sprite.setTint(0xff0000);
            if(!sprite.immune){
                playerHealth -= 50;
                healthbar.updateHealthbar(playerHealth);
            }
            sprite.immune = true;
            immune(sprite);
        })

        const immune = (sprite) => this.time.delayedCall(1000, function() {
            sprite.setTint(0xffffff);
            sprite.immune = false;
        }, this);

        this.physics.add.collider(enemy.group, ground);
        this.physics.add.collider(enemy.group, movementEnemies, function(){
            enemy.checkDirection();
        });
        this.physics.add.collider(crystal.group, ground);
        this.physics.add.collider(firefly.group, ground);
        this.physics.add.collider(crystal.group, firefly, function(crystal, firefly){
            crystal.x += 120;
            firefly.y -= -80;
        });

        // Check overlap between Crystal, Enemy and Player
        this.physics.add.overlap(this.player.sprite, crystal.group, collectCrystal, null, this);
        this.physics.add.overlap(this.player.sprite, firefly.group, collectFirefly, null, this);


        function collectCrystal (player, crystal) {
            if(playerHealth < 100){
                playerHealth += 50;
            }
            healthbar.updateHealthbar(playerHealth);
            crystal.disableBody(true, true);
        }

        function collectFirefly (player, firefly) {
            if (this.spotlight.scale + 0.3 >= 1 || lightbar.mask.x + 45 >= 150) {
                firefly.disableBody(true, true);
                lightbar.mask.x = 150;
                this.spotlight.scale = 1;
            } else {
                firefly.disableBody(true, true);
                lightbar.mask.x += 45;
                this.spotlight.scale += 0.3;
            }
            if(coverfill - 0.05 <= 0.8) {
                coverfill = 0.8;
            } else {
                coverfill -= 0.05;
            }
        }

        // camera
        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite);
        camera.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels );

        //timer
        timerText = this.add.text(width / 2, 50, '', { font: '40px catseye' }).setOrigin(0.5);
        timerText.setDepth(2);
        timerText.setFill('#88ADEB');
        this.timer = this.time.addEvent({ delay: 999999 });
        timerText.setScrollFactor(0);
    }

    update() {

        if(gameLoaded){
            this.player.sprite.x = newPlayerPosX;
            this.player.sprite.y = newPlayerPosY;
            healthbar.updateHealthbar(playerHealth);
            gameLoaded = false;
        }

        direction = this.player.update();

        // checking if arrow is still shooting & calculates new angle for sprite
        if(!justCreated && shooting){
            shooting = arrow.update(shooting);
        }
        // arrow has to be updated first before new angle can be calculated
        justCreated = false;
        // checks if left Button is clicked and no other arrow is still shooting, player has to be on Ground
        if (this.input.activePointer.leftButtonDown() && !shooting && this.player.sprite.body.blocked.down /*&&  (counterAfterSwitchScene == 0) */) {
            leftButtonPressed = true;
        }
        // only shoots arrow after left Button is also released
        if(this.input.activePointer.leftButtonReleased() && leftButtonPressed /* &&  (counterAfterSwitchScene == 0) */) {

            // calculates the angle of the shot with the position of the input in wordcoordinates and position of the player
            arrowRot = Math.atan2((this.input.activePointer.worldY - this.player.sprite.y), (this.input.activePointer.worldX - this.player.sprite.x)) * (180 / Math.PI);

            // checks if player is looking in the right direction for the shot
            if((direction === 'right' && (arrowRot >= -90 && arrowRot <= 90)) || direction === 'left' && (arrowRot <= -90 || arrowRot >= 90 )){

                arrow = new Arrow(this, this.player, arrowRot, ground, enemy);

                shooting = true;
                justCreated = true;
            }
            leftButtonPressed = false;
        }

        if(playerHealth <= 0) {
            gameoverModal.style.display = "block";
            pauseBtn.style.display = "none";
            this.player.sprite.setTint(0xff0000);
            this.scene.pause();
            restartGameOver.addEventListener("click", () => {
            gamescene.restartScene();
            counterAfterSwitchScene = 100;
          });
        }


        cover.setAlpha(coverfill);

        this.spotlight.setPosition(this.player.sprite.x, this.player.sprite.y);
        if(this.spotlight.scale > 0.4){
            this.spotlight.scale -= 0.0004;
        }
        lightbar.updateLightbar(this.spotlight);
        if(coverfill >= 0.95) {
            coverfill = 0.95;
        } else {
            coverfill += 0.00009;
        }

       // timerText.setText(formatTime(score + timer.getElapsedSeconds()));
        timerText.setText(gamescene.formatTime(score + this.timer.getElapsedSeconds()));


    }

    setPlayerHealth(health){
        playerHealth = health;
        healthbar.updateHealthbar(playerHealth);
    }

    updateLightBar(light){
        lightbar.mask.x = light;
    } 

    setTimer(timescore){
        score = timescore;
        gameLoaded = true;
    }

    updatePlayerPos(x, y){
        newPlayerPosX = x;
        newPlayerPosY = y;
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