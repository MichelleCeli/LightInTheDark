export default class PauseScene extends Phaser.Scene{

    constructor() {
        super({key: 'PauseScene'});
    }

    preload () {

    }

    create() {
        this.textA = this.add.text(10, 10, 'Game Over', { font: '32px Arial', fill: '#FFFFFF' });
    }

    update() {

    }
}