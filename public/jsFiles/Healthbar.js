let healthbarContainer;
let health;

export default class Healthbar {

    constructor(scene, x, y) {
        this.scene = scene;

        // add Container and Healthbar to scene
        healthbarContainer = scene.add
            .sprite(x, y, 'barBg')
            .setScrollFactor(0)
            .setDepth(2);

        health = scene.add.
        sprite(x, y, 'healthbar')
        .setScrollFactor(0)
        .setDepth(2);

        // Create Mask
        this.mask = scene.add
            .sprite(health.x, health.y, "healthbar")
            .setScrollFactor(0)
            .setDepth(2);

        this.mask.visible = false;

        // set mask on Healthbar
        health.mask = new Phaser.Display.Masks.BitmapMask(scene, this.mask);

    }

    updateHealthbar(playerHealth){
        if(playerHealth == 100){
            this.mask.x = 150;
        }else if(playerHealth == 50){
            this.mask.x = 51;
        }else if(playerHealth == 0){
            this.mask.x = -50;
        }
    }
}