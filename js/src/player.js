define(['phaser', 'lodash'], function(Phaser, _){

  var Player = function(mastersOfScrumApp, mosPlayerType, userAvatar){
      
        this.mastersOfScrumApp = mastersOfScrumApp;

        //Datas
        this.playerSettings = mosPlayerType;
        this.isTweening = false;
        this.isActive = false;
        this.isAlive = true;
        var x = 50;
        var y = this.playerSettings.startY;//mastersOfScrumApp.gameInstance.world.height/2;

        //Graphicx
        this.sprite = mastersOfScrumApp.gameInstance.add.sprite(x,y,this.playerSettings.spritePath);
        this.sprite.animations.add('walk');
        //2D physics
        this.sprite.anchor.set(0.5);
        mastersOfScrumApp.gameInstance.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.immovable = false;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.drag.set(0.2);
        this.sprite.body.maxVelocity.setTo(400,400);
        //1 == full rebound on collision
        this.sprite.body.bounce.setTo(1,1);
        //Angle == rotation
        this.sprite.angle = mastersOfScrumApp.gameInstance.rnd.angle();

        this.avatarSprite = mastersOfScrumApp.gameInstance.add.sprite(x,y,userAvatar);
        this.avatarSprite.anchor.set(0.5);
        //Angle == rotation
        this.avatarSprite.angle = this.sprite.angle;

        //
        ////dishes
        //this.dishes = mastersOfScrumApp.gameInstance.add.group();
        //this.dishes.enableBody = true;
        //this.dishes.physicsBodyType = Phaser.Physics.ARCADE;

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

        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.playerClicked, this);
  };

  Player.prototype = {

    damaged: function(stress){
        if(this.playerSettings.stress >0){
            this.playerSettings.stress -= stress;
        }
        if(this.playerSettings.stress < 0){
            this.playerLoss();
        }
    },
    update: function(){
        if(!this.isTweening && this.isActive){

            this.sprite.rotation = this.mastersOfScrumApp.gameInstance.physics.arcade.angleToPointer(this.sprite);

            if(this.playerSettings.moves > 0) {
                //if(this.mastersOfScrumApp.cursors.left.isDown){
                //    this.sprite.angle -=4;
                //}
                //else if(this.mastersOfScrumApp.cursors.right.isDown){
                //    this.sprite.angle +=4;
                //}

                if(this.mastersOfScrumApp.gameInstance.input.activePointer.isDown){
                    this.speed = 150;
                    this.sprite.animations.play('walk', 10);
                    this.playerSettings.moves -= 0.1;
                    this.mastersOfScrumApp.gameInstance.physics.arcade.velocityFromRotation(this.sprite.rotation, this.speed, this.sprite.body.velocity);
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
    playerLoss : function(){
        alert('lose.');
    },
    playerClicked: function(){
        console.log('player clicked ' + this.playerSettings.name);
        this.moveEmitter.kill();
        this.moveEmitter.visible = false;
        this.mastersOfScrumApp.board.setActivePlayer(this);
    }
  };

  return Player;

});