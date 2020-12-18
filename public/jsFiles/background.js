export class Background extends Phaser.Scene{
    constructor(){
        super({key: 'Background'});
    }

    preload(){
        this.load.image('bgBackSprite', './img/assets/background/background_1960x1080.png');
        this.load.image('bgBackTreeSprite', './img/assets/background/trees_bg_1960x1080.png');
        this.load.image('bgMiddleTreeSprite', './img/assets/background/trees_fg_1960x1080.png');
        this.load.image('bgFrontSprite', './img/assets/background/front_1960x1080.png');
    }

    create(){
        const width = this.scale.width;
        const height = this.scale.height;

        //background
        this.add.image(width * 0.5, height * 0.5, 'bgBackSprite')
            .setScrollFactor(0);

        createAligned(this, 3, 'bgBackTreeSprite', 0.15);
        createAligned(this, 3, 'bgMiddleTreeSprite', 0.3);
        createAligned(this, 3, 'bgFrontSprite', 0.5);
    }

    createAligned(scene, count, texture, scrollFactor){
        let x = scene.scale.width * 0.5;
        for (let i = 0; i < count; ++i) {
            const m = scene.add.image(x, scene.scale.height * 0.5, texture)
                .setScrollFactor(scrollFactor)

            x += m.width
    }
}
}
