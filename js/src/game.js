define(['phaser', 'lodash', 'board'], function(Phaser, _, Board){

    var MastersOfScrumApp = {};

    MastersOfScrumApp.init = function(h, w, mode, targetElement){
        MastersOfScrumApp.gameInstance = new Phaser.Game(h, w, mode, targetElement,{
            preload: MastersOfScrumApp.preload,
            create: MastersOfScrumApp.load,
            update: MastersOfScrumApp.update,
            render: MastersOfScrumApp.render
        });
    };

    //  The Google WebFont Loader will look for this object, so create it before loading the script.
    WebFontConfig = {
        //  'active' means all requested fonts have finished loading
        //  We set a 1 second delay before calling 'createText'.
        //  For some reason if we don't the browser cannot render the text the first time it's created.
        active: function() { MastersOfScrumApp.gameInstance.time.events.add(Phaser.Timer.SECOND, MastersOfScrumApp.createText, this); },

        //  The Google Fonts we want to load (specify as many as you like in the array)
        google: {
            families: ['Press Start 2P']
        }
    };

    MastersOfScrumApp.createText = function(){

        MastersOfScrumApp.logo = MastersOfScrumApp.gameInstance.add.text(400, 0, "MASTERS OF SCRUM");
        MastersOfScrumApp.logo.anchor.setTo(0.5);

        MastersOfScrumApp.logo.font = 'Press Start 2P';
        MastersOfScrumApp.logo.fontSize = 48;

//        //  x0, y0 - x1, y1
//        var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
//        grd.addColorStop(0, '#8ED6FF');
//        grd.addColorStop(1, '#004CB3');
        MastersOfScrumApp.logo.fill = '#FFFFFF';

        MastersOfScrumApp.logo.align = 'center';
        MastersOfScrumApp.logo.stroke = '#000000';
        MastersOfScrumApp.logo.strokeThickness = 2;
        MastersOfScrumApp.logo.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
        MastersOfScrumApp.logo.fixedtoCamera = true;

        MastersOfScrumApp.logo.bounce=MastersOfScrumApp.gameInstance.add.tween(MastersOfScrumApp.logo);
        MastersOfScrumApp.logo.bounce.to({ y: MastersOfScrumApp.gameInstance.world.height/4 }, 3000, Phaser.Easing.Bounce.Out);
        MastersOfScrumApp.logo.bounce.start();
    }

    MastersOfScrumApp.preload = function(){
        //Load all assets here
        //MastersOfScrumApp.gameInstance.load.image('ground', 'res/img/principalGreen.png');
        //MastersOfScrumApp.gameInstance.load.spritesheet('torso', 'res/img/torso2.png', 32, 32);
        //  Load the Google WebFont Loader script
        MastersOfScrumApp.gameInstance.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    };

    MastersOfScrumApp.load = function(){
        //1st time load
        MastersOfScrumApp.gameInstance.world.setBounds(0,0,1000,1000);

        //Sprites
        MastersOfScrumApp.groundSprite = MastersOfScrumApp.gameInstance.add.tileSprite(0,0,1024,768, 'ground');

        //Keyboard init
        MastersOfScrumApp.cursors = MastersOfScrumApp.gameInstance.input.keyboard.createCursorKeys();

        //Camera init
        MastersOfScrumApp.gameInstance.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);

        //Object
        MastersOfScrumApp.board = new Board(MastersOfScrumApp);

        //Start Intro
        MastersOfScrumApp.setUpIntro();

    };

    MastersOfScrumApp.update = function(){
        //Update data & collide stuff
        MastersOfScrumApp.board.update();

        ////Check to see if player touched any patrons
        //MastersOfScrumApp.gameInstance.physics.arcade.collide(
        //    MastersOfScrumApp.restaurant.patrons,
        //    MastersOfScrumApp.player.sprite,
        //    MastersOfScrumApp.player.playerHitPatron,
        //    null,
        //    MastersOfScrumApp.player);
        //

        //Keep ground tile centered on camera
        MastersOfScrumApp.groundSprite.tilePosition.x = -MastersOfScrumApp.gameInstance.camera.x;
        MastersOfScrumApp.groundSprite.tilePosition.y = -MastersOfScrumApp.gameInstance.camera.y;

    };

    MastersOfScrumApp.render = function(){
        //Draw all the things. Usually all this is done inside the objects.
    };

    MastersOfScrumApp.setUpIntro = function(){
        MastersOfScrumApp.gameInstance.camera.focusOnXY(0,0);
        MastersOfScrumApp.gameInstance.input.onDown.add(MastersOfScrumApp.removeLogo, this);
    };

    MastersOfScrumApp.removeLogo = function(){
        MastersOfScrumApp.gameInstance.input.onDown.remove(MastersOfScrumApp.removeLogo, MastersOfScrumApp.gameInstance);
        MastersOfScrumApp.logo.flicker = MastersOfScrumApp.gameInstance.add.tween(MastersOfScrumApp.logo);
        MastersOfScrumApp.logo.flicker.to({alpha:0}, 50, Phaser.Easing.Linear.None, true, 0, 50);
        MastersOfScrumApp.logo.flicker.start();

        MastersOfScrumApp.startNewRound();
    };

    MastersOfScrumApp.startNewRound = function(){
        //Init new game session
        MastersOfScrumApp.board.reset();
    };

    return MastersOfScrumApp;
});

