let arrowOldX;
let arrowOldY;
let arrowRot;

export default class Arrow {

    constructor(scene, player, arrowRot, ground, enemy) {
        this.scene = scene;

        // Create Sprite
        this.sprite = scene.physics.add
            .sprite(scene.player.sprite.x, scene.player.sprite.y, "arrow")
            .setAngle(arrowRot);

        //sets Velocity with Class-Method
        this.setVelocity(scene, this);

        //sets the old x and y for calculating the new angle in update()
        arrowOldX = this.sprite.x;
        arrowOldY = this.sprite.y;

        // hitbox of arrow
        this.sprite.body.setSize(10, 1, true);

        scene.physics.add.collider(this.sprite, ground, function (arrow) {

            arrow.body.moves = false;
            let timedEvent = scene.time.delayedCall(8000, onEvent, [arrow], this);
        });

        scene.physics.add.overlap(this.sprite, enemy.group, killEnemy, null, this);
    }


    setVelocity(scene, arrow) {
        let velArX = (scene.input.activePointer.worldX - arrow.sprite.x);
        let velArY = (scene.input.activePointer.worldY - arrow.sprite.y);

        arrow.sprite.setVelocityX(velArX);
        arrow.sprite.setVelocityY(velArY);
    }

    // updates the angle of the arrow while shooting
    update(shooting) {
        if (shooting && this.sprite.body.moves) {

            arrowRot = Math.atan2((this.sprite.y - arrowOldY), (this.sprite.x - arrowOldX)) * (180 / Math.PI);
            this.sprite.setAngle(arrowRot);

            // values are overwritten for next calculation
            arrowOldX = this.sprite.x;
            arrowOldY = this.sprite.y;
        }
        // when sprite is collided with ground or is outside of the window
        if(this.sprite.y > 1000 || !this.sprite.body.moves){
            shooting = false;
        }

        return shooting;
    }

}

// after timer ends from collision with layer ground
function onEvent (arrow)
{
    arrow.disableBody(true, true);
}

// if arrow hits an enemy
function killEnemy(arrow, enemy) {
    if(arrow.body.moves) {
        arrow.body.moves = false;
        arrow.disableBody(true, true);
        enemy.disableBody(true, true);
    }
}