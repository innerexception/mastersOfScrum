define(['phaser', 'lodash'], function(Phaser, _){

  var Player = function(mastersOfScrumApp, mosPlayerType, userAvatar){
      
        this.mastersOfScrumApp = mastersOfScrumApp;

      //Datas
        this.playerSettings = mosPlayerType;
        this.isTweening = false;
        this.isActive = false;
        this.isAlive = true;
        var x = -50;
        var y = this.playerSettings.startY;//mastersOfScrumApp.gameInstance.world.height/2;

        //Graphicx
        this.sprite = mastersOfScrumApp.gameInstance.add.sprite(x,y,this.playerSettings.spritePath);
        //2D physics
        this.sprite.anchor.set(0.5);
        mastersOfScrumApp.gameInstance.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.immovable = false;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.drag.set(100);
        this.sprite.body.maxVelocity.setTo(400,400);
        //1 == full rebound on collision
        this.sprite.body.bounce.setTo(0.05,0.05);
        //Angle == rotation
        //this.sprite.angle = mastersOfScrumApp.gameInstance.rnd.angle();

        this.avatarSprite = mastersOfScrumApp.gameInstance.add.sprite(x,y,userAvatar);
        this.avatarSprite.anchor.set(0.5);
        //Angle == rotation
        this.avatarSprite.angle = this.sprite.angle;
        this.avatarSprite.inputEnabled = true;
        this.avatarSprite.events.onInputDown.add(this.playerClicked, this);
        this.avatarSprite.events.onInputOver.add(this.playerMouseOver, this);
        this.avatarSprite.events.onInputOut.add(this.playerMouseOut, this);

      mastersOfScrumApp.gameInstance.physics.enable(this.avatarSprite, Phaser.Physics.ARCADE);
        this.avatarSprite.body.immovable = false;
        this.avatarSprite.body.collideWorldBounds = true;
        this.avatarSprite.body.drag.set(100);
        this.avatarSprite.body.maxVelocity.setTo(400,400);
        //1 == full rebound on collision
        this.avatarSprite.body.bounce.setTo(0.05,0.05);

        //bug shots
        this.bullets = this.mastersOfScrumApp.gameInstance.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.mastersOfScrumApp.gameInstance.input.onDown.add(this.fireBullet, this);

        this.sprite.bringToTop();
        this.avatarSprite.bringToTop();

        //stress
        this.moveEmitter = mastersOfScrumApp.gameInstance.add.emitter(this.sprite.x, 200, 200);

        this.moveEmitter.makeParticles('smoke');

        this.moveEmitter.setRotation(0, 90);
        this.moveEmitter.setAlpha(0.3, 0.8);
        this.moveEmitter.gravity = 0;

      //	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
        //	The 3000 value is the lifespan of each particle before it's killed
        //this.moveEmitter.start(false, 3000, 1000);

        this.sprite.fall=this.mastersOfScrumApp.gameInstance.add.tween(this.sprite)
          .to({x: 50}, 2000, Phaser.Easing.Bounce.Out);
        this.sprite.fall.start();
        this.avatarSprite.fall=this.mastersOfScrumApp.gameInstance.add.tween(this.avatarSprite)
          .to({x: 50}, 2000, Phaser.Easing.Bounce.Out);
        this.avatarSprite.fall.start();

  };

  Player.prototype = {
    fireBullet: function(){
        if(this.isActive && this.mastersOfScrumApp.board.hasActiveBugs && this.playerSettings.bugShots){
            var bullet = this.bullets.create(this.avatarSprite.x,this.avatarSprite.y, 'foosBall', 17);
            this.mastersOfScrumApp.gameInstance.physics.arcade.accelerateToPointer(bullet, null, 250);
            this.playerSettings.bugShots--;
        }
    },
    removeMoves: function(){
        this.playerSettings.moves = 0;
    },
    playerMouseOver: function(){
        this.mastersOfScrumApp.drawTooltip(this.avatarSprite.x, this.avatarSprite.y-25, this.playerSettings.name + ' Moves:' + Math.round(this.playerSettings.moves));
    },
    playerMouseOut: function(){
        this.mastersOfScrumApp.killTooltip();
    },
    update: function(){
        if(!this.isTweening && this.isActive && this.mastersOfScrumApp.board.isReady){

            this.sprite.rotation = this.mastersOfScrumApp.gameInstance.physics.arcade.angleToPointer(this.sprite);

            this.mastersOfScrumApp.board.activeCursorSprite.x = this.sprite.x;
            this.mastersOfScrumApp.board.activeCursorSprite.y = this.sprite.y;
            this.mastersOfScrumApp.board.activeCursorSprite.rotation = this.sprite.rotation;

            if(this.mastersOfScrumApp.board.hasActiveBugs){
                this.mastersOfScrumApp.board.arrowSprite.rotation = this.sprite.rotation;
                this.mastersOfScrumApp.board.arrowSprite.x = this.mastersOfScrumApp.gameInstance.input.mousePointer.x;
                this.mastersOfScrumApp.board.arrowSprite.y = this.mastersOfScrumApp.gameInstance.input.mousePointer.y;
                this.mastersOfScrumApp.board.arrowSprite.scale.x =1;
                this.mastersOfScrumApp.board.arrowSprite.scale.y =1;
                //Draw ammo meter
//                this.ammoMeterSprite.x = this.avatarSprite.x;
//                this.ammoMeterSprite.y = this.avatarSprite.y+50;
//                this.ammoMeterSprite.scale.x = 1;
//                this.ammoMeterSprite.scale.y = 1;

            }
            else{
                this.mastersOfScrumApp.board.arrowSprite.scale.x = 0.00001;
                this.mastersOfScrumApp.board.arrowSprite.scale.y = 0.00001;
//                this.ammoMeterSprite.scale.x = 0.0001;
//                this.ammoMeterSprite.scale.y = 0.0001;
            }

            if(this.playerSettings.moves > 0 && !this.mastersOfScrumApp.board.hasActiveBugs) {
                if(this.mastersOfScrumApp.gameInstance.input.activePointer.isDown){
                    this.speed = 150;
                    this.playerSettings.moves -= 0.1;
                    this.mastersOfScrumApp.gameInstance.physics.arcade.velocityFromRotation(this.sprite.rotation, this.speed, this.sprite.body.velocity);
                    this.sprite.scale.x = (this.playerSettings.moves / this.playerSettings.maxMoves) * (this.playerSettings.maxMoves / 25);
                    if(!this.moveEmitter.on) {
                        this.moveEmitter.start(false, 3000, 250);
                    }
                }
                else{
                    this.moveEmitter.on = false;
                }
            }
            else{
                if(this.moveEmitter.on){
                    this.moveEmitter.on = false;
                }
            }
        }
        else{
            if(this.moveEmitter.on){
                this.moveEmitter.on = false;
            }
        }

        //If collide with other player, fill their movement
        _.each(this.mastersOfScrumApp.board.players, function(player){
            this.mastersOfScrumApp.gameInstance.physics.arcade.collide(
                this.sprite,
                player.avatarSprite,
                this.scrumPlayerCollide,
                null,
                this);
        }, this);

        if(this.playerSettings.moves > 0) {
            this.sprite.scale.x = (this.playerSettings.moves / this.playerSettings.maxMoves) * (this.playerSettings.maxMoves / 25);
        }
        else{
            this.sprite.scale.x = 0.000001;
        }

        if(this.speed > 0){
            this.speed -=14;
            this.speed = Math.max(0, this.speed);
            this.mastersOfScrumApp.gameInstance.physics.arcade.velocityFromRotation(this.sprite.rotation, this.speed, this.sprite.body.velocity);
        }

        this.avatarSprite.angle = this.sprite.angle;

        this.moveEmitter.x = this.sprite.x;
        this.moveEmitter.y = this.sprite.y;
        this.avatarSprite.x = this.sprite.x;
        this.avatarSprite.y = this.sprite.y;

    },
    playerClicked: function(){
        console.log('player clicked ' + this.playerSettings.name);
        this.moveEmitter.kill();
        this.moveEmitter.visible = false;
        this.mastersOfScrumApp.board.setActivePlayer(this);
    },
    scrumPlayerCollide: function(scrumSprite, playerSprite){
        var qaObj = _.find(this.mastersOfScrumApp.board.players, function (player) {
            return player.sprite === scrumSprite;
        });
        if(qaObj.playerSettings.name === 'SCRUM') {
            var playerObj = _.find(this.mastersOfScrumApp.board.players, function (player) {
                return player.avatarSprite === playerSprite;
            });
            if (playerObj.playerSettings.moves != playerObj.playerSettings.maxMoves) {
                playerObj.playerSettings.moves = playerObj.playerSettings.maxMoves;
            }
            console.log('scrum refill!!');
        }
    },
    destroy: function(){

        //Graphicx
        this.sprite.destroy();
        this.avatarSprite.destroy();

        //stress
        this.moveEmitter.destroy();
    }
  };

  return Player;

});