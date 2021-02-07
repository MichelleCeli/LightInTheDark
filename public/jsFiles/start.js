import GameScene from "./gameScene.js";
import SecondLevel from "./secondLevel.js";

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
    scene: [ GameScene, SecondLevel ]
};
  
 var game = new Phaser.Game(config);
