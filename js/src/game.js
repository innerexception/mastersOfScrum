define(['phaser', 'lodash', 'player', 'restaurant'], function(Phaser, _, Player, Restaurant){

    var WaitingGameApp = {};

    WaitingGameApp.init = function(h, w, mode, targetElement){
        WaitingGameApp.gameInstance = new Phaser.Game(h, w, mode, targetElement,{
            preload: WaitingGameApp.preload,
            create: WaitingGameApp.load,
            update: WaitingGameApp.update,
            render: WaitingGameApp.render
        });
    };

    //  The Google WebFont Loader will look for this object, so create it before loading the script.
    WebFontConfig = {
        //  'active' means all requested fonts have finished loading
        //  We set a 1 second delay before calling 'createText'.
        //  For some reason if we don't the browser cannot render the text the first time it's created.
        active: function() { WaitingGameApp.gameInstance.time.events.add(Phaser.Timer.SECOND, WaitingGameApp.createText, this); },

        //  The Google Fonts we want to load (specify as many as you like in the array)
        google: {
            families: ['Press Start 2P']
        }
    };

    WaitingGameApp.createText = function(){

        WaitingGameApp.logo = WaitingGameApp.gameInstance.add.text(320, -20, "WAITING GAME");
        WaitingGameApp.logo.anchor.setTo(0.5);

        WaitingGameApp.logo.font = 'Press Start 2P';
        WaitingGameApp.logo.fontSize = 48;

//        //  x0, y0 - x1, y1
//        var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
//        grd.addColorStop(0, '#8ED6FF');
//        grd.addColorStop(1, '#004CB3');
        WaitingGameApp.logo.fill = '#FFFFFF';

        WaitingGameApp.logo.align = 'center';
        WaitingGameApp.logo.stroke = '#000000';
        WaitingGameApp.logo.strokeThickness = 2;
        WaitingGameApp.logo.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
        WaitingGameApp.logo.fixedtoCamera = true;

        WaitingGameApp.logo.bounce=WaitingGameApp.gameInstance.add.tween(WaitingGameApp.logo);
        WaitingGameApp.logo.bounce.to({ y: 200 }, 3000, Phaser.Easing.Bounce.Out);
        WaitingGameApp.logo.bounce.start();
    }

    WaitingGameApp.preload = function(){
        //Load all assets here
        //WaitingGameApp.gameInstance.load.image('ground', 'res/img/principalGreen.png');
        //WaitingGameApp.gameInstance.load.spritesheet('torso', 'res/img/torso2.png', 32, 32);
        //  Load the Google WebFont Loader script
        WaitingGameApp.gameInstance.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    };

    WaitingGameApp.load = function(){
        //1st time load
        WaitingGameApp.gameInstance.world.setBounds(0,0,1000,1000);

        //Sprites
        WaitingGameApp.groundSprite = WaitingGameApp.gameInstance.add.tileSprite(0,0,1024,768, 'ground');

        //Keyboard init
        WaitingGameApp.cursors = WaitingGameApp.gameInstance.input.keyboard.createCursorKeys();

        //Camera init
        WaitingGameApp.gameInstance.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);

        //Objects
        WaitingGameApp.player = new Player(WaitingGameApp);
        WaitingGameApp.restaurant = new Restaurant(WaitingGameApp);

        WaitingGameApp.setUpIntro();

    };

    WaitingGameApp.update = function(){
        //Update data & collide stuff

        if(WaitingGameApp.player)
            WaitingGameApp.player.update();
        //restaurant has tables, tables have patrons, only need to call update at top level
        if(WaitingGameApp.restaurant)
            WaitingGameApp.restaurant.update();

        if(WaitingGameApp.player.isAlive){
            //Check to see if player touched any patrons
            WaitingGameApp.gameInstance.physics.arcade.collide(
                WaitingGameApp.restaurant.patrons,
                WaitingGameApp.player.sprite,
                WaitingGameApp.player.playerHitPatron,
                null,
                WaitingGameApp.player);
            //Check to see if player hit any servers
            WaitingGameApp.gameInstance.physics.arcade.collide(
                WaitingGameApp.restaurant.servers,
                WaitingGameApp.player.sprite,
                WaitingGameApp.player.playerHitServer,
                null,
                WaitingGameApp.player);
            //Check to see if player hit any stations
            WaitingGameApp.gameInstance.physics.arcade.collide(
                WaitingGameApp.restaurant.stations,
                WaitingGameApp.player.sprite,
                WaitingGameApp.player.playerHitStation,
                null,
                WaitingGameApp.player);
        }

        //Keep ground tile centered on camera
        WaitingGameApp.groundSprite.tilePosition.x = -WaitingGameApp.gameInstance.camera.x;
        WaitingGameApp.groundSprite.tilePosition.y = -WaitingGameApp.gameInstance.camera.y;

    };

    WaitingGameApp.render = function(){
        //Draw all the things. Usually all this is done inside the objects.

    };

    WaitingGameApp.setUpIntro = function(){
        WaitingGameApp.gameInstance.camera.focusOnXY(0,0);
        WaitingGameApp.gameInstance.input.onDown.add(WaitingGameApp.removeLogo, this);
    };

    WaitingGameApp.removeLogo = function(){
        WaitingGameApp.gameInstance.input.onDown.remove(WaitingGameApp.removeLogo, WaitingGameApp.gameInstance);
        WaitingGameApp.startNewRound();
    };

    WaitingGameApp.startNewRound = function(){
        WaitingGameApp.logo.flicker = WaitingGameApp.gameInstance.add.tween(WaitingGameApp.logo);
        WaitingGameApp.logo.flicker.to({alpha:0}, 50, Phaser.Easing.Linear.None, true, 0, 50);
        WaitingGameApp.logo.flicker.start();
    };

    return WaitingGameApp;
});

