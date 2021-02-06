let lightbarContainer;
let light;

export default class Lightbar {

    constructor(scene, x, y) {
        this.scene = scene;

        // add Container and Lightbar to scene
        lightbarContainer = scene.add
            .sprite(x, y, 'barBg')
            .setScrollFactor(0)
            .setDepth(2);

        light = scene.add.sprite(x, y, 'lightbar')
            .setScrollFactor(0)
            .setDepth(2);

        // Create Mask
        this.mask = scene.add
            .sprite(light.x, light.y, "lightbar")
            .setScrollFactor(0)
            .setDepth(2);

        this.mask.visible = false;

        // set mask on Lightbar
        light.mask = new Phaser.Display.Masks.BitmapMask(scene, this.mask);

    }

    updateLightbar(spotlight) {
        if(spotlight.scale >= 0.4 && this.mask.x <= -41) {
            this.mask.x -= -41;
        } else {
            this.mask.x -= 0.10;
        }
    }
}