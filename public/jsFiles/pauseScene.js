export default class PauseScene extends Phaser.Scene{

    constructor() {
        super({key: 'PauseScene'});
    }

    preload () {

    }

    create() {
        this.textA = this.add.text(10, 10, 'Funktionert, ich werde geladen', { font: '32px Arial', fill: '#FFFFFF' });
    }

    update() {

    }
}