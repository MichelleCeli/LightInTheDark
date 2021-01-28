import GameScene from "./gameScene.js";
import PauseScene from "./pauseScene.js";

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
        }
    },
    scene: [ GameScene, PauseScene ]
};
  
var game = new Phaser.Game(config);
