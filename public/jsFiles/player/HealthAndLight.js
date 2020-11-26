var healthBar;
var innerBar;
var outerBar;
var lightBar;
var innerBar2;
var outerBar2;


    var overlay = new PIXI.Graphics();
    overlay.beginFill(0x000000);
    overlay.drawRect(0,0, app.screen.width, app.screen.height);
    overlay.endFill();
    overlay.alpha = 0.5;
    app.stage.addChild(overlay);

    var test = new PIXI.Graphics();
    test.beginFill(0xFFFFFF);
    test.drawCircle(200,200,30);
    test.endFill();
    var blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 30;
    test.filters = [blurFilter];
    
    app.stage.addChild(test);

    var circle = new PIXI.Graphics();
    circle.beginFill(0xFFFFFF);
    circle.drawCircle(0,0,100);
    circle.endFill();
    circle.alpha = 0.6;
    circle.blendMode = PIXI.BLEND_MODES.SOFT_LIGHT;
    //Player sprite
    player = PIXI.Sprite.from('images/player.png');
    player.anchor.set(0.5);
    player.position;
    
     player.light = circle;

     player.addChild(circle);
    app.stage.addChild(player);

    healthBar = new PIXI.Container();
healthBar.position.set(50,30);
app.stage.addChild(healthBar);

innerBar = new PIXI.Graphics();
innerBar.beginFill(0x000000);
innerBar.drawRoundedRect(0, 0, 300, 20, 10);
innerBar.endFill();
healthBar.addChild(innerBar);

//Create the front red rectangle
outerBar = new PIXI.Graphics();
outerBar.beginFill(0xFF3300);
outerBar.drawRoundedRect(0, 0, 300, 20, 10);
outerBar.endFill();
healthBar.addChild(outerBar);

healthBar.outer = outerBar; 



lightBar = new PIXI.Container();
lightBar.position.set(50,70);
app.stage.addChild(lightBar);

innerBar2 = new PIXI.Graphics();
innerBar2.beginFill(0x000000);
innerBar2.drawRoundedRect(0, 0, 300, 20, 10);
innerBar2.endFill();
lightBar.addChild(innerBar2);

//Create the front red rectangle
outerBar2 = new PIXI.Graphics();
outerBar2.beginFill(0xFFFF00);
outerBar2.drawRoundedRect(0, 0, 300, 20, 10);
outerBar2.endFill();
lightBar.addChild(outerBar2);

lightBar.outer = outerBar2; 

//fireflies
firefly = PIXI.Sprite.from('images/firefly.png');
firefly.anchor.set(0.5);
firefly.position.set(300,400);
app.stage.addChild(firefly);

//crystal
crystal = PIXI.Sprite.from('images/crystal.png');
crystal.anchor.set(0.5);
crystal.position.set(200,450);
app.stage.addChild(crystal);


function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  
    //hit will determine whether there's a collision
    hit = false;
  
    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2; 
    r1.centerY = r1.y + r1.height / 2; 
    r2.centerX = r2.x + r2.width / 2; 
    r2.centerY = r2.y + r2.height / 2; 
  
    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
  
    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
  
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
  
      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
  
        //There's definitely a collision happening
        hit = true;
      } else {
  
        //There's no collision on the y axis
        hit = false;
      }
    } else {
  
      //There's no collision on the x axis
      hit = false;
    }
  
    //`hit` will be either `true` or `false`
    return hit;
  };