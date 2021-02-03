/* import { start } from "repl"; */
import Player from "./player.js";
import Enemy from "./enemy.js";
import SecondLevel from "./secondLevel.js";

let isPlayerDead;
let playerHealth;
let timer, timerText;
let enemy;

// Pause Button Variablen
let pauseBtn = document.getElementById("pause-btn");
let pauseModal = document.getElementById("pause-modal");
let resumeGame = document.getElementById("resume-game");
let saveGame = document.getElementById("save-game");
let restartGame = document.getElementById("restart-game");
let counterAfterSwitchScene;

// Gameover Modal
let gameoverModal = document.getElementById("gameover-modal");

//Save Game
let saveModal = document.getElementById("save-modal");
let saveGame2 = document.getElementById("save-game2");


// Arrow Variablen
let arrow;
var velArX;
var velArY;
let leftButtonPressed = false;
let arrowRot;
let shooting = false;
let arrowOldX;
let arrowOldY;
var justCreated;
let direction;

let map;
let ground;

let switchScene;
let score = 0;
let gameLoaded = false;
let newPlayerPosX;
let newPlayerPosY;
let newHealth;


// TODO: MovementEnemies
// TODO: World Bounds                              FINISHED
// TODO: Arrow auslegen?
// TODO: Monster auslegen                          FINISHED
// TODO: Starbildschirm überarbeiten
// TODO: Player AI Datei Schatten auswechseln
// TODO: Dokumentation
// TODO: Menu responsive

// TODO: weiteres Monster???




export default class GameScene extends Phaser.Scene{

    constructor() {
        super({key: 'GameScene'});
    }

    preload ()
    {
        //Hintergrund Bilder
        this.load.image('bgBackSprite', './img/assets/background/background_1960x1080.png');
        this.load.image('bgBackTreeSprite', './img/assets/background/trees_bg_1960x1080.png');
        this.load.image('bgMiddleTreeSprite', './img/assets/background/trees_fg_1960x1080.png');
        this.load.image('bgFrontSprite', './img/assets/background/front_1960x1080.png');

        //Player Spritesheet
        this.load.spritesheet('player', './img/assets/player.png',  { frameWidth: 80, frameHeight: 75 });

        //Health and Lightbar
        this.load.image('barBg', './img/healthbar.png');
        this.load.image('healthbar', './img/healthbar_red.png');
        this.load.image('lightbar', './img/lightbar_yellow.png');

        //Collectables
        this.load.image('crystal', './img/crystal_small.png');
        /* this.load.image('enemy', './img/enemy.png'); */
        this.load.spritesheet('enemy', './img/assets/enemy_sprite.png', { frameWidth: 53, frameHeight: 36 });
        this.load.spritesheet('firefly', './img/assets/firefly_02.png',  { frameWidth: 35, frameHeight: 35 });

        // tilemap
        this.load.image("basement", "./img/assets/maps/basement.png");
        this.load.tilemapTiledJSON("map", "./img/assets/maps/map.json");
    // Level 2    this.load.tilemapTiledJSON("map", "./img/assets/maps/mapLevel2.json");

        this.load.image('pause-btn', './img/assets/pause-btn.png');

        this.cursor = this.input.keyboard.createCursorKeys();

        // weapon
        this.load.image("arrow", "./img/arrow.png");

        // door
        this.load.image("door", "./img/assets/door.png");

    }

    create (){

        switchScene = this;
        const width = this.scale.width;
        const height = this.scale.height;

        counterAfterSwitchScene = 0;

        //background
        const bg1 = this.add.image(width*0.5, height*0.5, 'bgBackSprite')
                .setScrollFactor(0);

        const bg2 = createAligned(this, 3, 'bgBackTreeSprite', 0.15);
        const bg3 = createAligned(this, 3, 'bgMiddleTreeSprite', 0.3);
        const bg4 = createAligned(this, 3, 'bgFrontSprite', 0.5);

        let gameOptions = 60;

        // tilemap

        map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("basement", "basement"); //.png???

        ground = map.createLayer("ground", tileset, 0, 0);
        const thorns = map.createLayer("thorns", tileset, 0, 0);
        const movementEnemies = map.createLayer("movementEnemies", tileset, 0, 0);

        this.physics.world.setBounds(0, 0, map.width*10, height);
        this.physics.world.setBoundsCollision(true, true, false, false);

        // cover
        const cover = this.add.graphics();
        cover.fillStyle(0x000000, 0.85);
        cover.fillRect(0,0, width, height);
        cover.setScrollFactor(0);

        //healthbar, lightbar
        this.timeLeft = gameOptions.initialTime;

        let healthbarContainer = this.add.sprite(150, 50, 'barBg');
        healthbarContainer.setScrollFactor(0);
        healthbarContainer.setDepth(2);
        let healthbar = this.add.sprite(healthbarContainer.x, healthbarContainer.y, 'healthbar');
        healthbar.setScrollFactor(0);
        healthbar.setDepth(2);
        this.healthMask = this.add.sprite(healthbar.x, healthbar.y, 'healthbar');
        this.healthMask.setScrollFactor(0);
        this.healthMask.setDepth(2);
        this.healthMask.visible = false;


        let lightbarContainer = this.add.sprite(150, 100, 'barBg');
        lightbarContainer.setScrollFactor(0);
        lightbarContainer.setDepth(2);
        let lightbar = this.add.sprite(lightbarContainer.x, lightbarContainer.y, 'lightbar');
        lightbar.setScrollFactor(0);
        lightbar.setDepth(2);
        this.lightMask = this.add.sprite(lightbar.x, lightbar.y, 'lightbar');
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

        enemy = new Enemy(this, ground);

        // Firefly 
        //let firefly = this.add.sprite('firefly');

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('firefly', { start: 0, end: 12 }),
            frameRate: 12,
            repeat: -1
        });

        let firefly = this.physics.add.group({
            key: 'firefly',
            repeat: 20,
            setXY: { x: 250, y: 0, stepX: Phaser.Math.FloatBetween(300, 500) }
        });

        firefly.children.iterate(function (child) {
            child.setBounce(0.1);
            child.anims.play('fly', true);
        });


        // Door for Game End

        let door = this.physics.add.staticSprite(3900, 415, 'door');
      //  let door = this.physics.add.staticSprite(5900, 600, 'door');
        door.setScrollFactor(1);

        // Player
        isPlayerDead = false;
        this.player = new Player(this, 200, 700);

        //Testing Map 2
       // this.player = new Player(this, 200, 300);
        playerHealth = 100;

        //Spotlight
        this.spotlight = this.make.graphics();
        this.spotlight.fillStyle(0xfffffff);
        this.spotlight.fillCircle(0, 0, 128);

        const mask = this.spotlight.createGeometryMask();
        mask.setInvertAlpha(true);
        cover.setMask(mask);
        cover.setDepth(1);


        // set collision
        ground.setCollisionByProperty({collides : true});
        thorns.setCollisionByProperty({collides : true});
        movementEnemies.setCollisionByProperty({collides : true});

        this.physics.add.collider(this.player.sprite, ground);
        this.physics.add.collider(this.player.sprite, thorns, function(sprite, thorns){
            sprite.setVelocityY(-380);
            playerHealth -= 50;
            updateHealthBar();
        });

        this.physics.add.collider(crystal, ground);
        this.physics.add.collider(firefly, ground);
        this.physics.add.collider(enemy.group, ground);
        this.physics.add.collider(enemy.group, movementEnemies, function(){
          enemy.checkDirection();
        });

        this.physics.add.collider(this.player.sprite, enemy.group, function(sprite) {
            sprite.setTint(0xff0000);
            if(!sprite.immune){
                playerHealth -= 50;
                //healthMask.x -= 99;
                updateHealthBar();
            }
            sprite.immune = true;
            immune(sprite);
        })

        
        const immune = (sprite) => this.time.delayedCall(1000, function() {
                sprite.setTint(0xffffff);
               sprite.immune = false;
           }, this);
        

        // Check overlap between Crystal, Enemy and Player
        this.physics.add.overlap(this.player.sprite, crystal, collectCrystal, null, this);
        this.physics.add.overlap(this.player.sprite, firefly, collectFirefly, null, this);
        
        
        function collectCrystal (player, crystal) {
            if(playerHealth >= 100) {
                crystal.disableBody(true, true);
            } else {
                playerHealth += 50;
                updateHealthBar();
                crystal.disableBody(true, true);
            }
        }

        function collectFirefly (player, firefly) {
            if (this.spotlight.scale + 0.4 >= 1 || this.lightMask.x + 45 >= 150) {
                firefly.disableBody(true, true);
                this.lightMask.x = 150;
                this.spotlight.scale = 1;
            } else {
                firefly.disableBody(true, true);
                this.lightMask.x += 55;
                this.spotlight.scale += 0.4;
            }
        }


        // Check overlap between Player and door
        this.physics.add.overlap(this.player.sprite, door, endLevel, null, this);
        function endLevel(player, door) {
            setNewHighscore();
            switchScene.scene.start("SecondLevel");
        }


        // Kamera Einstellungen
        // camera
        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels );

        //timer
        timerText = this.add.text(width / 2, 50, '', { font: '40px catseye' }).setOrigin(0.5);
        timerText.setDepth(2);
        timerText.setFill('#88ADEB');
        timer = this.time.addEvent({ delay: 999999 });
        timerText.setScrollFactor(0);


    }



    //
    // Update Methode
    //

    update(){

        if(gameLoaded){
            this.player.sprite.x = newPlayerPosX;
            this.player.sprite.y = newPlayerPosY;
            updateHealthBar();
            gameLoaded = false;
        }



        if(counterAfterSwitchScene > 0){
            counterAfterSwitchScene -= 1;
            leftButtonPressed = false;
        }


        direction = this.player.update();

        // checking if arrow is still shooting & calculates new angle for sprite
        if (shooting && !justCreated && arrow.body.moves){

            arrowRot = Math.atan2((arrow.y - arrowOldY), (arrow.x - arrowOldX))*(180/Math.PI);

            arrow.angle = arrowRot;

            arrowOldX = arrow.x;
            arrowOldY = arrow.y;

            if(arrow.y > 1000){
                shooting = false;
            }

        }

        // arrow has to be updated first before new angle can be calculated
        justCreated = false;
        // checks if left Button is clicked and no other arrow is still shooting
        if (this.input.activePointer.leftButtonDown() && !shooting && this.player.sprite.body.blocked.down && (counterAfterSwitchScene == 0)) {
            leftButtonPressed = true;
        }

        // only shoots arrow after left Button is also released
            if(this.input.activePointer.leftButtonReleased() && leftButtonPressed && (counterAfterSwitchScene == 0)) {

                // calculates the angle of the shot with the position of the input in wordcoordinates and position of the player
                arrowRot = Math.atan2((this.input.activePointer.worldY - this.player.sprite.y), (this.input.activePointer.worldX - this.player.sprite.x)) * (180 / Math.PI);

                // checks if player is looking in the right direction for the shot
              if((direction === 'right' && (arrowRot >= -90 && arrowRot <= 90)) || direction === 'left' && (arrowRot <= -90 || arrowRot >= 90 )){

                arrow = createArrow(this, arrowRot, ground , enemy);

                arrowOldX = arrow.x;
                arrowOldY = arrow.y;

                justCreated = true;
            }
                leftButtonPressed = false;
            }



      /*  console.log(playerHealth);*/
/*         if(playerHealth <= 0 ){
            isPlayerDead = true;
            this.player.destroy();
            timerText.setText('- : -');
        }
        if (isPlayerDead){return} */

        if(playerHealth <= 0) {
            gameoverModal.style.display = "block";
            pauseBtn.style.display = "none";
            this.player.sprite.setTint(0xff0000);
            switchScene.scene.pause();
        } 


        this.spotlight.setPosition(this.player.sprite.x, this.player.sprite.y);
        if(this.spotlight.scale > 0.4){
             this.spotlight.scale -= 0.0004;
        }
        if(this.spotlight.scale >= 0.4) {
            this.lightMask.x <= -41;
        }
        if(this.lightMask.x <= -41) {
            this.lightMask.x <= -41;
        } else {
            this.lightMask.x -= 0.10;
        }

        timerText.setText(formatTime(score + timer.getElapsedSeconds()));
        //console.log(timerText);

    }
}


function createArrow(scene, arrowRot, ground, enemy){
    shooting = true;

    arrow = scene.physics.add
        .sprite(scene.player.sprite.x, scene.player.sprite.y, "arrow")
        .setAngle(arrowRot);

    // calculates and sets Velocity of the arrow (gravity is working automatically through Arcade.Physics)
    velArX = (scene.input.activePointer.worldX - arrow.x);
    velArY = (scene.input.activePointer.worldY - arrow.y);
    arrow.setVelocityX(velArX);
    arrow.setVelocityY(velArY);

    // collider with the ground and the enemies
    scene.physics.add.collider(arrow, ground, function(arrow){
        arrow.body.moves = false;
        shooting = false;
        let timedEvent = scene.time.delayedCall(8000, onEvent, [arrow], this);
    });

    scene.physics.add.overlap(arrow, enemy.group, killEnemy, null, this);

    return arrow;
}

// happens when arrow collides with enemy
function killEnemy(arrow, enemy) {
    if(arrow.body.moves) {
        shooting = false;
        arrow.disableBody(true, true);
        enemy.disableBody(true, true);
    }
}

// after some time, the arrow gets disabled
function onEvent (arrow)
{
    arrow.disableBody(true, true);
}


const createAligned = (scene, count, texture, scrollFactor) => {
    let x = scene.scale.width*0.5;
    for(let i = 0; i < count; ++i){
        const m = scene.add.image(x, scene.scale.height *0.5, texture)
                .setScrollFactor(scrollFactor)

        x += m.width
    }
}

function clickPause() {
  pauseBtn.addEventListener("click", () => {
    toggleModal();
    switchScene.scene.pause();
  });

  function toggleModal() {
    if (pauseModal.style.display === "none") {
      pauseModal.style.display = "block";
      pauseBtn.style.display = "none";
    } else {
      pauseModal.style.display = "none";
    }
  }

  saveGame.addEventListener("click", () =>{
      toggleModal();
    saveModal.style.display = "block";
  })
  saveGame2.addEventListener("click", () => {
      let score = Math.round(timer.getElapsedSeconds());
      let position = [switchScene.player.sprite.x, switchScene.player.sprite.y];
      let level = 1;
      let title = document.getElementById("saveTitle").value;
      let light = switchScene.lightMask.x;
      $.ajax({
        url: '/saveGame',
        method: 'POST',
        data: {level, score, position, title, playerHealth, light}
    })  
    .done(function(res){
        location.assign('/loadGame');
    })   
  });

  //resume
  resumeGame.addEventListener("click", () => {
    toggleModal();
    pauseBtn.style.display = "block";
    switchScene.scene.resume('GameScene');
  });

  restartGame.addEventListener("click", () => {
    location.reload();
  });
}



//Pause Button
pauseModal.style.display = "none";
clickPause();


function formatTime(seconds){
    // Minutes
    var minutes = Math.floor(seconds/60);
    // Seconds
    var partInSeconds = seconds%60;
    partInSeconds = Math.round(partInSeconds);
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
}

function setTimer(timescore){
    score = timescore;
}

function updatePlayerPos(x, y){
    newPlayerPosX = x;
    newPlayerPosY = y;
}

$.ajax({
    url: '/getSavedGame',
    method: 'GET'
})
    .done(function (res) {
        if(res){
            gameLoaded = true;
            setPlayerHealth(res.lifepoints);
            setTimer(res.score);
            updatePlayerPos(res.position[0], res.position[1]);
           // updateLightBar(res.lightpoints);
        }
    }) 

function setPlayerHealth(health){
    playerHealth = health;
}

function updateHealthBar(){
    if(playerHealth == 100){
        switchScene.healthMask.x = 150;
    }else if(playerHealth == 50){
        switchScene.healthMask.x = 51;
    }else if(playerHealth == 0){
        switchScene.healthMask.x = -50;
    }
} 

/* function updateLightBar(light){
    switchScene.lightMask.x = light;
} */

function setNewHighscore(){
    let time = Math.round(timer.getElapsedSeconds());
    let level = 1;
    $.ajax({
        url: '/saveScore',
        method: 'POST',
        data: {level, time}
    })  
    .done(function(res){
        console.log("saved Highscore");
    })   
}