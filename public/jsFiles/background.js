    var bgBack;
    var bgBackTree;
    var bgMiddleTree;
    var bgFront;
    var bgX = 0;
    var bgSpeed = 1;


        // Pfad für die Bilder wird festgelegt
        /*
        app.loader.baseUrl = "img/assets/background";
        app.loader
            .add("bgBack", "background_1960x1080.png")
            .add("bgBackTree", "trees_bg_1960x1080.png")
            .add("bgMiddleTree", "trees_fg_1960x1080.png")
            .add("bgFront", "front_1960x1080.png");
*/

bgBack = bgBackSprite;
bgBackSprite.position.set(0,0);
console.log("Bild lädt");
app.stage.addChild(bgBack);

bgBackTree = bgBackTreeSprite;
bgBackTree.position.set(0,0);
app.stage.addChild(bgBackTree);


bgMiddleTree = bgMiddleTreeSprite;
bgMiddleTree.position.set(0,0);
app.stage.addChild(bgMiddleTree);

bgFront = bgFrontSprite;
bgFront.position.set(0,0);
app.addChild(bgFront);

/*
        function initLevel() {
            bgBack = createBg(app.loader.resources["bgBack"].texture);
            bgBackTree = createBg(app.loader.resources["bgBackTree"].texture);
            bgMiddleTree = createBg(app.loader.resources["bgMiddleTree"].texture);
            bgFront = createBg(app.loader.resources["bgFront"].texture);
        }
*/
        // Texturen werden geladen
       /* function createBg(texture) {
            let tiling = new PIXI.TilingSprite(texture, 1200, 900);
            tiling.position.set(0,0);
            app.stage.addChild(tiling);

            return tiling;
        }
*/
        // Schnelligkeit der Hintergrundbilder
        function updateBg() {
            bgX = (bgX + bgSpeed);
            bgMiddleTree.tilePosition.x = bgX;
            bgBackTree.tilePosition.x = bgX / 2;
            bgBack.tilePosition.x = bgX / 4;
        }

        function playerMoveToLeft(){
            bgSpeed = bgSpeed +1;
        }
        
        function playerMoveToRight(){
            bgSpeed = bgSpeed -1;
        }
        
        function playerPause() {
            bgSpeed = 0;
        }



        //function initBackground(canvas) {
        //    canvas.addChild();
        //}
