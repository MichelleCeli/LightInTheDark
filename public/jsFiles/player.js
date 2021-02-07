let direction = "right";

// Versuch: Lösen des Problems der Browserkompabilität (Bugs mit Firefox)
/*let pressUp;
let lastPressUp;
let pressRight;
let lastPressRight;
let counterRight;
let firstIterationRight;

let lastPressLeft;
let pressLeft;
let counterLeft;
let firstIterationLeft;*/


export default class Player {

    constructor(scene, x, y) {
        this.scene = scene;

        // Animation of the player
        const anims = scene.anims;

        anims.create({
            key: "left",
            frames: anims.generateFrameNumbers("player", {start: 0, end: 4}),
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
            frames: [{key: 'player', frame: 0}],
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
            .setBounce(0.1)
            .setCollideWorldBounds(true);
        this.sprite.body.setSize(50, 75, true);

        // Keys
        const {LEFT, RIGHT, UP, W, A, D, SPACE} = Phaser.Input.Keyboard.KeyCodes;

        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            w: W,
            a: A,
            d: D,
            space: SPACE
        });

        // Versuch: Lösen des Problems der Browserkompabilität (Bugs mit Firefox)
       /* counterLeft = 0;
        counterRight = 0;

        firstIterationLeft = true;
        firstIterationRight = true;*/

    }

    freeze() {
        this.sprite.body.moves = false;
    }

    update() {
        const {keys, sprite} = this;
        const onGround = sprite.body.blocked.down;
        let pressUp;

         if (keys.left.isDown || keys.a.isDown) {

             sprite.setVelocityX(-160);
             direction = "left";
            // console.log(sprite.body.velocity.x);

             if(onGround)
             {sprite.anims.play('left', true);}

         } else if (keys.right.isDown || keys.d.isDown) {
             sprite.setVelocityX(160);
             direction = "right";

             if (onGround)
             {sprite.anims.play('right', true);}

         } else {
             sprite.setVelocityX(0);
             if(direction === 'right') {
                 sprite.anims.play('turnFromRight');
             } else {
                 sprite.anims.play('turnFromLeft');
             }
         }

        // Versuch: Lösen des Problems der Browserkompabilität (Bugs mit Firefox)
        /*pressLeft = keys.a.repeats;
       pressRight = keys.d.repeats;
       pressUp = keys.w.repeats;*/

        //console.log(pressLeft);
      /*  if (keys.left.isDown || keys.a.isDown){
             this.checkLeft(onGround, keys);
        }
        else if (keys.right.isDown || keys.d.isDown) {
            this.checkRight(onGround);

        } else {
            sprite.setVelocityX(0);
            if (direction === 'right') {
                sprite.anims.play('turnFromRight');
            } else {
                sprite.anims.play('turnFromLeft');
            }
        }*/


        if (onGround && (keys.up.isDown || keys.w.isDown || keys.space.isDown) /* && (lastPressUp !== pressUp || pressUp === 0 ) */ ) {
            sprite.setVelocityY(-380);

        }

            if(!onGround){
            if (direction === 'right'){
                sprite.anims.play('turnFromRight');
            } else {
                sprite.anims.play('turnFromLeft');
            }
        }

            // Versuch: Lösen des Problems der Browserkompabilität (Bugs mit Firefox)
           // console.log(pressUp);
           // lastPressUp = pressUp;
/*
            if(!this.keys.a.isDown){
                counterLeft = 0;
                firstIterationLeft = true;
            }
        if(!this.keys.d.isDown){
            counterRight = 0;
            firstIterationRight = true;
        }*/

        return direction;
    }

    // Versuch: Lösen des Problems der Browserkompabilität (Bugs mit Firefox)
   /* checkLeft(onGround){
        if(!onGround){
            counterLeft = 40;
            firstIterationLeft = 40;
        }
        if (counterLeft == 0){
            if(firstIterationLeft){
                counterLeft = 40;
                firstIterationLeft = false;
                lastPressLeft = pressLeft -1;
            }else {
            counterLeft = 7;
            lastPressLeft = pressLeft;
            }
        }
        if (counterLeft == 1){
            console.log("onGround: " + onGround);
            if(lastPressLeft == pressLeft && onGround){
                console.log("gleiche Werte");
                this.keys.a.isDown = false;
                firstIterationLeft = true;
                counterLeft = 0;
                return;
            }else{counterLeft = 1;}
        }

            this.sprite.setVelocityX(-160);
            direction = "left";

            if(onGround)
            {this.sprite.anims.play('left', true);}

            counterLeft = counterLeft - 1;
    }


        checkRight(onGround){
        if(!onGround){counterRight = 100;
        firstIterationRight = true;}
            if (counterRight == 0){
                if(firstIterationRight){
                    counterRight = 40;
                    firstIterationRight = false;
                    lastPressRight = pressRight -1;
                }else counterRight = 7;
                lastPressRight = pressRight;
            }

            if (counterRight == 1){
                if(lastPressRight == pressRight){
                    console.log("gleiche Werte Rechts");
                    this.keys.d.isDown = false;
                    counterRight = 0;
                    return;
                }else{
                    counterRight = 1;
                }
            }
                this.sprite.setVelocityX(160);
                direction = "right";

                if (onGround)
                {this.sprite.anims.play('right', true);}

            counterRight = counterRight - 1;

            }
*/

    destroy() {
        this.sprite.destroy();
    }
}