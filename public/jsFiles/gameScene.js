/* import { start } from "repl"; */
import Player from "./player.js";
import Enemy from "./enemy.js";
import SecondLevel from "./secondLevel.js";
import Arrow from "./Arrow.js";
import Crystal from "./crystal.js";
import Firefly from "./firefly.js";
import Healthbar from "./Healthbar.js";
import Lightbar from "./Lightbar.js";

let isPlayerDead;
let playerHealth;
let timer, timerText;
let crystal;
let firefly;
let enemy;
let cover;
let coverfill;
let healthbar;
let lightbar;

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
let saveMessage = document.getElementById("saveMessage");


// Arrow Variablen
let arrow;
let leftButtonPressed = false;
let arrowRot;
let shooting = false;
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


// TODO: Dokumentation                             GELSESEN -> Texte hinzufügen
// TODO: CHrome API mit Firefox vergleichen und Bug lösen
// TODO: Arrow horizontal
// TODO: Menu responsive
// TODO: 2. Level Elemente hinzufügen




export default class GameScene extends Phaser.Scene{

    constructor() {
        super({key: 'GameScene'});

        this.level = 1;
    }

    preload ()
    {
        //Hintergrund Bilder
        this.load.image('bgBackSprite', './img/assets/background/background_1960x1080.png');
        this.load.image('bgBackTreeSprite', './img/assets/background/trees_bg_1960x1080.png');
        this.load.image('bgMiddleTreeSprite', './img/assets/background/trees_fg_1960x1080.png');
        this.load.image('bgFrontSprite', './img/assets/background/front_1960x1080.png');

        //Player Spritesheet
        this.load.spritesheet('player', './img/assets/Player_Spritesheet.png',  { frameWidth: 80, frameHeight: 75 });

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

        ground.setCollisionByProperty({collides : true});
        thorns.setCollisionByProperty({collides : true});
        movementEnemies.setCollisionByProperty({collides : true});

        const doorSpawnPoint = map.findObject("Objects", obj => obj.name === "Door Position");

        this.physics.world.setBounds(0, 0, map.width*10, height);
        this.physics.world.setBoundsCollision(true, true, false, false);

        // cover
        cover = this.add.rectangle(0,0, width*2, height*2, 0x000000);
        coverfill = 0.8;
        cover.setAlpha(coverfill);
        //cover.fillStyle(0x000000, coverfill);
        //cover.fillRect(0,0, width, height);
        cover.setScrollFactor(0);

        //healthbar, lightbar
        this.timeLeft = gameOptions.initialTime;

        healthbar = new Healthbar(this, 150, 50);
        lightbar = new Lightbar(this, 150, 100);

        //Spotlight
        this.spotlight = this.make.graphics();
        this.spotlight.fillStyle(0xfffffff);
        this.spotlight.fillCircle(0, 0, 128);

        const mask = this.spotlight.createGeometryMask();
        mask.setInvertAlpha(true);
        cover.setMask(mask);
        cover.setDepth(1);


        // Level Elemente einfügen

        crystal = new Crystal(this, 4, 250, 600, 800, this.player, playerHealth, healthbar);
        enemy = new Enemy(this, ground);
        firefly = new Firefly(this, 20, 200, 300, 500);

        // Door for Game End
        let door = this.physics.add.sprite(doorSpawnPoint.x, doorSpawnPoint.y, 'door');
        door.setSize(30, 90, true);
        door.setScrollFactor(1);

        // Player
        isPlayerDead = false;
       // this.player = new Player(this, 200, 700);

        //Testing Map 2
        this.player = new Player(this, 3500, 300);
        playerHealth = 100;


        // set collisions

        this.physics.add.collider(door, ground);
        this.physics.add.collider(this.player.sprite, ground);
        this.physics.add.collider(this.player.sprite, thorns, function(sprite, thorns){
            sprite.setVelocityY(-380);
            playerHealth -= 50;
            healthbar.updateHealthbar(playerHealth);
        });

        this.physics.add.collider(crystal.group, ground);
        this.physics.add.collider(firefly.group, ground);
        this.physics.add.collider(crystal.group, firefly, function(crystal, firefly){
            crystal.x += 120;
            firefly.y -= -80;
        });
        this.physics.add.collider(enemy.group, ground);
        this.physics.add.collider(enemy.group, movementEnemies, function(){
          enemy.checkDirection();
        });

        this.physics.add.collider(this.player.sprite, enemy.group, function(sprite) {
            sprite.setTint(0xff0000);
            if(!sprite.immune){
                playerHealth -= 50;
                //healthMask.x -= 99;
                healthbar.updateHealthbar(playerHealth);
            }
            sprite.immune = true;
            immune(sprite);
        })


        
        const immune = (sprite) => this.time.delayedCall(1000, function() {
                sprite.setTint(0xffffff);
               sprite.immune = false;
           }, this);
        

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

        // Check overlap between Player and door
        this.physics.add.overlap(this.player.sprite, door, endLevel, null, this);
        function endLevel(player, door) {
            setNewHighscore();
            switchScene.scene.start("SecondLevel");
            this.scene.stop();
        }

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

      //  loadGame();
    }

    //
    // Update Methode
    //
    update(){

        if(gameLoaded){
            this.player.sprite.x = newPlayerPosX;
            this.player.sprite.y = newPlayerPosY;
            //healthbar.updateHealthbar(playerHealth);
            gameLoaded = false;
        }

        if(counterAfterSwitchScene > 0){
            counterAfterSwitchScene -= 1;
            leftButtonPressed = false;
        }
        direction = this.player.update();

        // checking if arrow is still shooting & calculates new angle for sprite
        if(!justCreated && shooting){
            shooting = arrow.update(shooting);
        }
        // arrow has to be updated first before new angle can be calculated
        justCreated = false;
        // checks if left Button is clicked and no other arrow is still shooting, player has to be on Ground
        if (this.input.activePointer.leftButtonDown() && !shooting && this.player.sprite.body.blocked.down && (counterAfterSwitchScene == 0)) {
            leftButtonPressed = true;
        }
        // only shoots arrow after left Button is also released
            if(this.input.activePointer.leftButtonReleased() && leftButtonPressed && (counterAfterSwitchScene == 0)) {

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

        timerText.setText(formatTime(score + timer.getElapsedSeconds()));
        //console.log(timerText);

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
      let level = switchScene.level;
      console.log(level);
      let title = document.getElementById("saveTitle").value;
   //   let light = switchScene.lightMask.x;
      $.ajax({
        url: '/saveGame',
        method: 'POST',
        data: {level, score, position, title, playerHealth, light}
    })
    .done(function(res){
        if(res === 'success'){
            location.assign('/loadGame');
        }else if(res.type === 'error'){
            console.log(res.res);
            $("#saveMessage").html(res.res);
        }
    })   
  });

  //resume
  resumeGame.addEventListener("click", () => {
    toggleModal();
    pauseBtn.style.display = "block";
    counterAfterSwitchScene = 100;
    switchScene.scene.resume('GameScene');
  });

  restartGame.addEventListener("click", () => {
    toggleModal();
    console.log(switchScene.level);
    pauseBtn.style.display = "block";
    switchScene.scene.restart();
    counterAfterSwitchScene = 100;
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

function loadGame(){
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
                updateLightBar(res.lightpoints);
            }
        }) 
} 


function setPlayerHealth(health){
    playerHealth = health;
    healthbar.updateHealthbar(playerHealth);
}

function updateLightBar(light){
  //  switchScene.lightMask.x = light;
} 

function setNewHighscore(){
    let time = Math.round(timer.getElapsedSeconds());
    let level = switchScene.level;
    $.ajax({
        url: '/saveScore',
        method: 'POST',
        data: {level, time}
    })  
    .done(function(res){
        console.log("saved Highscore");
    })   
}