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

        this.group = scene.physics.add.group({
            key: 'firefly',
            repeat: repeat,
            setXY: { x: x, y: 0, stepX: Phaser.Math.FloatBetween(stepX1, stepX2) }
        });

        this.group.children.iterate(function (child) {
            child.setBounce(0.1);
            child.anims.play('fly', true);
        });

    }

    checkDirection(){
        this.group.getChildren().forEach(function (child){
            if (child.body.blocked.left){
                child.setVelocity(100, 0);
            }
            if (child.body.blocked.right){
                child.setVelocity(-100, 0);
            }
        });
    }

}