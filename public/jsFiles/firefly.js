export default class Firefly {

    constructor(scene, repeat, x, stepX1, stepX2) {
        this.scene = scene;

        // Animation
        const anims = scene.anims;

        anims.create({
            key: 'fly',
            frames: anims.generateFrameNumbers('firefly', { start: 0, end: 12 }),
            frameRate: 12,
            repeat: -1
        });

        // Adding group to Arcade.Physics
        this.group = scene.physics.add.group({
            key: 'firefly',
            repeat: repeat,
            setXY: { x: x, y: 0, stepX: Phaser.Math.FloatBetween(stepX1, stepX2) }
        });

        // Setting properties to every child
        this.group.children.iterate(function (child) {
            child.setBounce(0.1);
            child.anims.play('fly', true);
        });

    }

}