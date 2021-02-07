

export default class Crystal {

    constructor(scene, repeat, x, stepX1, stepX2, player, playerHealth, healthbar) {
        this.scene = scene;

        // Adding group to Arcade.Physics
        this.group = scene.physics.add.group({
            key: 'crystal',
            repeat: repeat,
            setXY: { x: x, y: 0, stepX: Phaser.Math.FloatBetween(stepX1, stepX2) },
        });

        // Setting properties to every child
        this.group.children.iterate(function (child) {
            child.setSize(20, 60, true);
            child.setScrollFactor(1);
            child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));
        });


    }

}