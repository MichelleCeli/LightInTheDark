
export default class Enemy {

    constructor(scene) {
        this.scene = scene;

        // Animation
        const anims = scene.anims;

        anims.create({
            key:'enemy-blink',
            frames: anims.generateFrameNumbers('enemy', {start: 0, end: 3}),
            frameRate:6,
            repeat: -1,
        })

        // adding group to Arcade.Physics
        this.group = scene.physics.add.group({
            key: 'enemy',
            repeat: 12,
            setXY: { x: 650, y: 300, stepX: Phaser.Math.FloatBetween(300, 400) },
        });

        // Setting properties for every child of the group
        this.group.children.iterate(function (child) {
            child.setBounce(0.2); //0.2
            child.body.setVelocityX(-150);
            child.body.setCircle(20);
            child.setGravityY(130);
            child.setScrollFactor(1);
            child.anims.play('enemy-blink', true);
        });

    }

    // method for checking in which direction enemies are blocked by layer "movementEnemies" to set new direction
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