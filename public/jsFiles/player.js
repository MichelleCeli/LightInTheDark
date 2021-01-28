let direction = "right";
let inAir = false;

export default class Player {

    constructor(scene, x, y) {
        this.scene = scene;

        // Animation
        const anims = scene.anims;

        anims.create({
            key: "left",
            frames: anims.generateFrameNumbers("player", { start: 0, end: 4 }),
            frameRate: 8,
            repeat: -1
        });

        anims.create({
            key: 'turnFromRight',
            frames: [{key: 'player', frame: 5}],
            frameRate: 20
        });
        anims.create({
            key: 'turnFromLeft',
            frames: [{key: 'player', frame: 4}],
            frameRate: 20
        });

        anims.create({
            key: 'right',
            frames: anims.generateFrameNumbers('player', {start: 5, end: 9}),
            frameRate: 8,
            repeat: -1,

        });

        // Create Sprite
        this.sprite = scene.physics.add
            .sprite(x, y, "player", 0)
            .setBounce(0.2)
            .setCollideWorldBounds(true);

        // Keys
        const {LEFT, RIGHT, UP, W, A, D} = Phaser.Input.Keyboard.KeyCodes;
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            w: W,
            a: A,
            d: D
        });
    }
    freeze() {
        this.sprite.body.moves = false;
    }

    update() {
        const {keys, sprite} = this;
        const onGround = sprite.body.blocked.down;
        if (onGround){ inAir = false;} // Boolean for stopping and setting direction of Animation while player jumps or falls
        if (!onGround) {inAir = true;}

        if (keys.left.isDown || keys.a.isDown) {
            sprite.setVelocityX(-160);
            direction = "left";

            if(!inAir)
            {sprite.anims.play('left', true);}

        } else if (keys.right.isDown || keys.d.isDown) {
            sprite.setVelocityX(160);
            direction = "right";

            if (!inAir)
            {sprite.anims.play('right', true);}

        } else {
            sprite.setVelocityX(0);
            if(direction === 'right') {
                sprite.anims.play('turnFromRight');
            } else {
                sprite.anims.play('turnFromLeft');
            }
        }


        if (onGround && (keys.up.isDown || keys.w.isDown)) {
            sprite.setVelocityY(-380);
            inAir = true;
        }

        if (inAir){
            if (direction === 'right'){
                sprite.anims.play('turnFromRight');
            } else {
                sprite.anims.play('turnFromLeft');
            }
        }

        return direction;
    }
    destroy() {
        this.sprite.destroy();
    }
}