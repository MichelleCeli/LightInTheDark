import GameScene from "./gameScene.js";

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
    scene: GameScene,
};
  
var game = new Phaser.Game(config);

let pauseBtn = document.getElementById("pause-btn");
let pauseModal = document.getElementById("pause-modal");
let resumeGame = document.getElementById("resume-game");
let restartGame = document.getElementById("restart-game");

/*
function clickPause() {
  pauseBtn.addEventListener("click", () => {
    toggleModal();
    //GameScene.paused;
    //game.pauseGame();
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
    //GameScene.resume();
  });

  restartGame.addEventListener("click", () => {
    location.reload();
  });
}


//Pause Button
pauseModal.style.display = "none";
clickPause();
*/