var player;
        var Engine = Matter.Engine;
        var engine = Engine.create();
        //const app = new PIXI.Application({autoResize: true, resolution: devicePixelRatio, anitalias: true, backgroundColor: 0x1099bb});
        const app = new PIXI.Application({view: document.getElementById('canvas'), forceCanvas: true, autoResize: true, backgroundColor: 0x1099bb });
        //document.body.appendChild(app.view);

        const rect = new PIXI.Graphics()
  
        // Add it to the stage
        app.stage.addChild(rect);

        // Listen for window resize events
        window.addEventListener('resize', resize);

        // Resize function window
        function resize() {
	      // Resize the renderer
	      app.renderer.resize(window.innerWidth, window.innerHeight);
  
        // You can use the 'screen' property as the renderer visible
        // area, this is more useful than view.width/height because
        // it handles resolution
        rect.position.set(app.screen.width, app.screen.height);
        }

        resize();
