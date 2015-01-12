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
        MastersOfScrumApp.logo.bounce.to({ y: MastersOfScrumApp.gameInstance.world.height/4 }, 3500, Phaser.Easing.Linear.None);
        MastersOfScrumApp.logo.bounce.start();

        MastersOfScrumApp.logoSub = MastersOfScrumApp.gameInstance.add.text(400, 40, "CLICK TO START");
        MastersOfScrumApp.logoSub.anchor.setTo(0.5);

        MastersOfScrumApp.logoSub.font = 'Press Start 2P';
        MastersOfScrumApp.logoSub.fontSize = 14;

//        //  x0, y0 - x1, y1
//        var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
//        grd.addColorStop(0, '#8ED6FF');
//        grd.addColorStop(1, '#004CB3');
        MastersOfScrumApp.logoSub.fill = '#FFFFFF';

        MastersOfScrumApp.logoSub.align = 'center';
        MastersOfScrumApp.logoSub.stroke = '#000000';
        MastersOfScrumApp.logoSub.strokeThickness = 2;
        MastersOfScrumApp.logoSub.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
        MastersOfScrumApp.logoSub.fixedtoCamera = false;

        MastersOfScrumApp.logoSub.bounce=MastersOfScrumApp.gameInstance.add.tween(MastersOfScrumApp.logoSub);
        MastersOfScrumApp.logoSub.bounce.to({ y: MastersOfScrumApp.gameInstance.world.height/3 }, 3500, Phaser.Easing.Linear.None);
        MastersOfScrumApp.logoSub.bounce.start();

        //Start Intro
        MastersOfScrumApp.setUpIntro();
    }

    MastersOfScrumApp.preload = function(){
        //Load all assets here
        MastersOfScrumApp.gameInstance.load.image('board', 'res/sprite/bg.png');
        MastersOfScrumApp.gameInstance.load.image('greenPlayer', 'res/sprite/greenPlayer.png');
        MastersOfScrumApp.gameInstance.load.image('yellowPlayer', 'res/sprite/yellowPlayer.png');
        MastersOfScrumApp.gameInstance.load.image('bluePlayer', 'res/sprite/bluePlayer.png');
        MastersOfScrumApp.gameInstance.load.image('babyBluePlayer', 'res/sprite/babyBluePlayer.png');
        MastersOfScrumApp.gameInstance.load.image('redPlayer', 'res/sprite/redPlayer.png');
        MastersOfScrumApp.gameInstance.load.image('greenStory', 'res/sprite/greenStory.png');
        MastersOfScrumApp.gameInstance.load.image('yellowStory', 'res/sprite/yellowStory.png');
        MastersOfScrumApp.gameInstance.load.image('blueStory', 'res/sprite/blueStory.png');
        MastersOfScrumApp.gameInstance.load.image('userA', 'res/sprite/userA.png');
        MastersOfScrumApp.gameInstance.load.image('userB', 'res/sprite/userB.png');
        MastersOfScrumApp.gameInstance.load.image('userC', 'res/sprite/userC.png');
        MastersOfScrumApp.gameInstance.load.image('userD', 'res/sprite/userD.png');
        MastersOfScrumApp.gameInstance.load.image('userE', 'res/sprite/userE.png');
        MastersOfScrumApp.gameInstance.load.image('smoke', 'res/sprite/smoke.png');
        MastersOfScrumApp.gameInstance.load.image('hourglass', 'res/sprite/hourglass.png');
        MastersOfScrumApp.gameInstance.load.image('gripper', 'res/sprite/smoke.png');
        MastersOfScrumApp.gameInstance.load.image('activeCursor', 'res/sprite/activeCursor.png');
        MastersOfScrumApp.gameInstance.load.image('moneyBag', 'res/sprite/moneybag.png');
        MastersOfScrumApp.gameInstance.load.image('bug', 'res/sprite/bug.png');
        MastersOfScrumApp.gameInstance.load.image('foosBall', 'res/sprite/foosBall.png');
        MastersOfScrumApp.gameInstance.load.image('target', 'res/sprite/target.png');


        //MastersOfScrumApp.gameInstance.load.spritesheet('torso', 'res/img/torso2.png', 32, 32);
        //  Load the Google WebFont Loader script
        MastersOfScrumApp.gameInstance.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    };

    MastersOfScrumApp.load = function(){
        //1st time load
        MastersOfScrumApp.gameInstance.world.setBounds(0,0,1600,600);

        MastersOfScrumApp.tooltips = {};

        //Base sprite
        MastersOfScrumApp.groundSprite = MastersOfScrumApp.gameInstance.add.sprite(0,0, 'board');
        MastersOfScrumApp.groundSprite.scale.x = 1.5;
        MastersOfScrumApp.groundSprite.scale.y = 1.5;
        MastersOfScrumApp.groundSprite.alpha = 0;
        MastersOfScrumApp.groundSprite.fadeIn = MastersOfScrumApp.gameInstance.add.tween(MastersOfScrumApp.groundSprite)
            .to({alpha: 0.8}, 2000, Phaser.Easing.Linear.None);
        MastersOfScrumApp.groundSprite.fadeIn.onComplete.addOnce(function(){
            MastersOfScrumApp.board = new Board(MastersOfScrumApp, 2, 2, 5, 5);
            MastersOfScrumApp.inGame = true;
        }, this);

        MastersOfScrumApp.gripperContext = MastersOfScrumApp.gameInstance.add.graphics();
        MastersOfScrumApp.connectionContext = MastersOfScrumApp.gameInstance.add.graphics();

        //Keyboard init
        //MastersOfScrumApp.cursors = MastersOfScrumApp.gameInstance.input.keyboard.createCursorKeys();

        //Camera init
        MastersOfScrumApp.gameInstance.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);

    };

    MastersOfScrumApp.update = function(){
        //Update data & collide stuff
        if(MastersOfScrumApp.board) MastersOfScrumApp.board.update();

        //Keep ground tile centered on camera
        //MastersOfScrumApp.groundSprite.tilePosition.x = -MastersOfScrumApp.gameInstance.camera.x;
        //MastersOfScrumApp.groundSprite.tilePosition.y = -MastersOfScrumApp.gameInstance.camera.y;

        //Mouse moves camera if not following something
        if(MastersOfScrumApp.inGame){
            var pointerPosition = MastersOfScrumApp.gameInstance.input.mousePointer.position;
            var camera = MastersOfScrumApp.gameInstance.camera;
            var cameraLocked = MastersOfScrumApp.gameInstance.camera.target;

            if(pointerPosition.x >= 775 && camera.x <= 1000){
                if(cameraLocked) MastersOfScrumApp.unlockCamera();
                camera.x+=5;
            }
            if(pointerPosition.y >= 575 && camera.y <= 1000){
                if(cameraLocked) MastersOfScrumApp.unlockCamera();
                camera.y+=5;
            }
            if(pointerPosition.x < 25 && camera.x > 0){
                if(cameraLocked) MastersOfScrumApp.unlockCamera();
                camera.x-=5;
            }
            if(pointerPosition.y < 25 && camera.y > 0){
                if(cameraLocked) MastersOfScrumApp.unlockCamera();
                camera.y-=5;
            }
        }
    };

    MastersOfScrumApp.render = function(){
        //Draw all the things. Usually all this is done inside the objects.
    };

    MastersOfScrumApp.setUpIntro = function(){
        MastersOfScrumApp.gameInstance.camera.focusOnXY(0,0);
        MastersOfScrumApp.gameInstance.input.onDown.add(MastersOfScrumApp.removeLogo, this);
    };

    MastersOfScrumApp.removeLogo = function(){
        MastersOfScrumApp.gameInstance.input.onDown.remove(MastersOfScrumApp.removeLogo, this);
        MastersOfScrumApp.logo.flicker = MastersOfScrumApp.gameInstance.add.tween(MastersOfScrumApp.logo);
        MastersOfScrumApp.logo.flicker.to({alpha:0}, 50, Phaser.Easing.Linear.None, true, 0, 40);
        MastersOfScrumApp.logo.flicker.start();
        MastersOfScrumApp.logoSub.flicker = MastersOfScrumApp.gameInstance.add.tween(MastersOfScrumApp.logoSub);
        MastersOfScrumApp.logoSub.flicker.to({alpha:0}, 50, Phaser.Easing.Linear.None, true, 0, 40);
        MastersOfScrumApp.logoSub.flicker.start();

        var bmp = MastersOfScrumApp.gameInstance.add.bitmapData(800, 600);
        bmp.ctx.beginPath();
        bmp.ctx.lineWidth = '300';
        bmp.ctx.strokeStyle = 'rgba(55,55,55,0.5)';
        bmp.ctx.moveTo(0,300);
        bmp.ctx.lineTo(800,300);
        bmp.ctx.stroke();
        bmp.ctx.closePath();
        MastersOfScrumApp.messageBackgroundSprite = MastersOfScrumApp.gameInstance.add.sprite(-800, 300, bmp);

        MastersOfScrumApp.startNewRound();
    };

    MastersOfScrumApp.unlockCamera = function(){
        if(MastersOfScrumApp.board){
            MastersOfScrumApp.board.setActivePlayer(null);
        }
    };

    MastersOfScrumApp.startNewRound = function(){
        //Init new game session

        //Object
        MastersOfScrumApp.groundSprite.fadeIn.start();

    };

    MastersOfScrumApp.runVictory = function(){
        for(var i=0; i<200; i++){
            var nextBag = MastersOfScrumApp.gameInstance.add.sprite(Math.random()*700,-50, 'moneyBag');
            MastersOfScrumApp.gameInstance.physics.enable(nextBag, Phaser.Physics.ARCADE);
            nextBag.fallIn = MastersOfScrumApp.gameInstance.add.tween(nextBag)
                .to({y: Math.random()*1000}, 2000, Phaser.Easing.Bounce.Out);
            nextBag.fallIn.delay(Math.random()*500).start();
        }
        var victoryText = MastersOfScrumApp.gameInstance.add.text(400, -20, "VICTORY!");
        victoryText.anchor.setTo(0.5);

        victoryText.font = 'Press Start 2P';
        victoryText.fontSize = 48;
        victoryText.fill = '#FFFFFF';
        victoryText.align = 'center';
        victoryText.stroke = '#000000';
        victoryText.strokeThickness = 2;
        victoryText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

        victoryText.bounce=MastersOfScrumApp.gameInstance.add.tween(victoryText);
        victoryText.bounce.to({ y: MastersOfScrumApp.gameInstance.world.height/2 }, 3000, Phaser.Easing.Linear.None);
        victoryText.bounce.onComplete.addOnce(function(){window.document.location.reload();});
        victoryText.bounce.start();

    };

    MastersOfScrumApp.runLoss = function(){

        MastersOfScrumApp.board.destroy();

        MastersOfScrumApp.groundSprite.fadeOut = MastersOfScrumApp.gameInstance.add.tween(MastersOfScrumApp.groundSprite)
            .to({alpha: 0}, 3000, Phaser.Easing.Linear.None);
        MastersOfScrumApp.groundSprite.fadeOut.start();

        var victoryText = MastersOfScrumApp.gameInstance.add.text(400, -20, "FAILED!");
        victoryText.anchor.setTo(0.5);

        victoryText.font = 'Press Start 2P';
        victoryText.fontSize = 48;
        victoryText.fill = '#FFFFFF';
        victoryText.align = 'center';
        victoryText.stroke = '#000000';
        victoryText.strokeThickness = 2;
        victoryText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

        victoryText.bounce=MastersOfScrumApp.gameInstance.add.tween(victoryText);
        victoryText.bounce.to({ y: MastersOfScrumApp.gameInstance.world.height/2 }, 3000, Phaser.Easing.Linear.None);
        victoryText.bounce.onComplete.addOnce(function(){window.document.location.reload();});
        victoryText.bounce.start();
    };

    MastersOfScrumApp.drawTooltip = function(x, y, text, fontSiez, delay){
        if(!MastersOfScrumApp.tooltips[text]){
            MastersOfScrumApp.tooltips[text] = MastersOfScrumApp.gameInstance.add.text(x, y, text);
            MastersOfScrumApp.tooltips[text].anchor.setTo(0.5);
            MastersOfScrumApp.tooltips[text].wordWrap = true;
            MastersOfScrumApp.tooltips[text].wordWrapWidth = 100;
            MastersOfScrumApp.tooltips[text].font = 'Press Start 2P';
            MastersOfScrumApp.tooltips[text].fontSize = fontSiez ? fontSiez : 8;
            MastersOfScrumApp.tooltips[text].fill = '#FFFFFF';
            MastersOfScrumApp.tooltips[text].align = 'center';
            MastersOfScrumApp.tooltips[text].stroke = '#000000';
            MastersOfScrumApp.tooltips[text].strokeThickness = 2;
            MastersOfScrumApp.tooltips[text].setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

            MastersOfScrumApp.tooltips[text].bounce=MastersOfScrumApp.gameInstance.add.tween(MastersOfScrumApp.tooltips[text].scale)
                .to({ x:1.1, y:1.1 }, 500, Phaser.Easing.Linear.None)
                .to({ x:1, y:1}, 500, Phaser.Easing.Linear.None)
                .loop();
            MastersOfScrumApp.tooltips[text].bounce.start();
        }
        var that = MastersOfScrumApp;
        window.setTimeout(function(){
            that.killTooltip(text);
        }, delay?delay:1000);
    };

    MastersOfScrumApp.killTooltip = function(text){
        if(MastersOfScrumApp.tooltips[text]){
            MastersOfScrumApp.tooltips[text].destroy();
            delete MastersOfScrumApp.tooltips[text];
        }
    };

    MastersOfScrumApp.drawBannerMessage = function(text, fontSiez, delay, callBack, context){
        if(!MastersOfScrumApp.tooltips[text]){
            MastersOfScrumApp.tooltips[text] = MastersOfScrumApp.gameInstance.add.text(-800, 300, text);
            MastersOfScrumApp.tooltips[text].anchor.setTo(0.5);
            MastersOfScrumApp.tooltips[text].wordWrap = true;
            MastersOfScrumApp.tooltips[text].wordWrapWidth = 700;
            MastersOfScrumApp.tooltips[text].font = 'Press Start 2P';
            MastersOfScrumApp.tooltips[text].fontSize = fontSiez ? fontSiez : 8;
            MastersOfScrumApp.tooltips[text].fill = '#FFFFFF';
            MastersOfScrumApp.tooltips[text].align = 'center';
            MastersOfScrumApp.tooltips[text].stroke = '#000000';
            MastersOfScrumApp.tooltips[text].strokeThickness = 2;
            MastersOfScrumApp.tooltips[text].setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

            MastersOfScrumApp.tooltips[text].bounce=MastersOfScrumApp.gameInstance.add.tween(MastersOfScrumApp.tooltips[text])
                .to({ x:400 }, 500, Phaser.Easing.Linear.None)
                .to({ x:420 }, delay ? delay : 3000)
                .to({ x:1600}, 500, Phaser.Easing.Linear.None);
            MastersOfScrumApp.tooltips[text].bounce.start();

            MastersOfScrumApp.messageBackgroundSprite.x = -800;
            MastersOfScrumApp.messageBackgroundSprite.y = 0;

            MastersOfScrumApp.messageBackgroundSprite.bounce=MastersOfScrumApp.gameInstance.add.tween(MastersOfScrumApp.messageBackgroundSprite)
                .to({ x:0 }, 500, Phaser.Easing.Linear.None)
                .to({ x:0 }, delay ? delay : 3000)
                .to({ x:1600}, 500, Phaser.Easing.Linear.None);
            if(callBack){
                MastersOfScrumApp.messageBackgroundSprite.bounce._lastChild.onComplete.addOnce(callBack, context);
            }
            MastersOfScrumApp.messageBackgroundSprite.bounce.start();

        }
        var that = MastersOfScrumApp;
        window.setTimeout(function(){
            that.killTooltip(text);
        }, delay?delay+1000:4000);
    };


    return MastersOfScrumApp;
});

