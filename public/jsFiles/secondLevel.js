import Player from "./player.js";
import Enemy from "./enemy.js";
import Crystal from "./crystal.js";
import Firefly from "./firefly.js";
import Arrow from "./Arrow.js";

let lightbar;
let map2;
let ground;
let isPlayerDead;
let playerHealth;
let direction;
let enemy;
let firefly;
let crystal;

let shooting;
let justCreated;
let leftButtonPressed;
let arrowRot;
let arrow;

export default class SecondLevel extends Phaser.Scene{

    constructor() {
        super({key: 'SecondLevel'});
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
        let healthMask = this.add.sprite(healthbar.x, healthbar.y, 'healthbar');
        healthMask.setScale(0.2);
        healthMask.setScrollFactor(0);
        healthMask.setDepth(2);
        healthMask.visible = false;

        let lightbarContainer = this.add.sprite(150, 100, 'barBg');
        lightbarContainer.setScale(0.2);
        lightbarContainer.setScrollFactor(0);
        lightbarContainer.setDepth(2);
        lightbar = this.add.sprite(lightbarContainer.x, lightbarContainer.y, 'lightbar');
        lightbar.setScale(0.2);
        lightbar.setScrollFactor(0);
        lightbar.setDepth(2);
        this.lightMask = this.add.sprite(lightbar.x, lightbar.y, 'lightbar');
        this.lightMask.setScale(0.2);
        this.lightMask.setScrollFactor(0);
        this.lightMask.setDepth(2);
        this.lightMask.visible = false;


        healthbar.mask = new Phaser.Display.Masks.BitmapMask(this, healthMask);
        lightbar.mask = new Phaser.Display.Masks.BitmapMask(this, this.lightMask);


        // Player
        isPlayerDead = false;
  // Testing     this.player = new Player(this, 40000, 500);
        this.player = new Player(this, 200, 500);
        playerHealth = 100;
        leftButtonPressed = false;



        enemy = new Enemy(this, ground);
        crystal = new Crystal(this, 4, 250, 600, 800);
        firefly = new Firefly(this, 20, 200, 300, 500);





        // set collision
        ground.setCollisionByProperty({collides : true});
        thorns.setCollisionByProperty({collides : true});
        movementEnemies.setCollisionByProperty({collides : true});

        this.physics.add.collider(door2, ground);
        this.physics.add.collider(this.player.sprite, door2);
        this.physics.add.collider(this.player.sprite, ground);
        this.physics.add.collider(this.player.sprite, thorns, function(sprite, thorns){
            sprite.setVelocityY(-380);
            healthMask.x -= 99;
            playerHealth -= 50;
        });
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

        // camera
        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite);
        camera.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels );


     //   this.textA = this.add.text(10, 10, 'Game Over', { font: '32px Arial', fill: '#FFFFFF' });
    }

    update() {

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