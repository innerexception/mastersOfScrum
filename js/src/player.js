define(['phaser', 'lodash'], function(Phaser, _){

  var Player = function(waitingGameApp){
    this.waitingGameApp = waitingGameApp;

    var x = 200;
    var y = 200;//waitingGameApp.gameInstance.world.height/2;

    //Datas
    this.stress = 100;
    this.stressRate = 1.0;
    this.activeItem = null;
    this.isTweening = false;
    this.isAlive = true;

    //Graphicx
    this.sprite = waitingGameApp.gameInstance.add.sprite(x,y,'playerSprite');
    this.sprite.animations.add('walk');
    //2D physics
    this.sprite.anchor.set(0.5);
    waitingGameApp.gameInstance.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = false;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.drag.set(0.2);
    this.sprite.body.maxVelocity.setTo(400,400);
    //1 == full rebound on collision
    this.sprite.body.bounce.setTo(1,1);
    //Angle == rotation
    this.sprite.angle = waitingGameApp.gameInstance.rnd.angle();

    //dishes
    this.dishes = waitingGameApp.gameInstance.add.group();
    this.dishes.enableBody = true;
    this.dishes.physicsBodyType = Phaser.Physics.ARCADE;

    this.sprite.bringToTop();

    //stress
    this.stressEmitter = waitingGameApp.gameInstance.add.emitter(this.sprite.x, this.sprite.y, 200);

    this.stressEmitter.makeParticles(['stressSprite1', 'stressSprite2', 'stressSprite3']);

    this.stressEmitter.setRotation(0, 0);
    this.stressEmitter.setAlpha(0.3, 0.8);
    this.stressEmitter.setScale(0.5, 1);
    this.stressEmitter.gravity = 0;

      //	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
      //	The 5000 value is the lifespan of each particle before it's killed
    this.stressEmitter.start(false, 3000, 1000);
  };

  Player.prototype = {
    damaged: function(stress){
        if(this.stress <=100){
            this.stress += stress;
        }
        if(this.stress > 100){
            this.playerLoss();
        }
    },
    update: function(){
        if(!this.isTweening){
            if(this.waitingGameApp.cursors.left.isDown){
                this.sprite.angle -=4;

            }
            else if(this.waitingGameApp.cursors.right.isDown){
                this.sprite.angle +=4;

            }
            if(this.waitingGameApp.cursors.up.isDown){
                this.speed = 150;
                this.sprite.animations.play('walk', 10);

            }
            else{
                if(this.speed > 0){
                    this.speed -=14;
                }
            }
            if(this.waitingGameApp.gameInstance.input.activePointer.isDown){
                //Maybe do something on click?
            }

            if(this.speed > 0){
                this.waitingGameApp.gameInstance.physics.arcade.velocityFromRotation(this.sprite.rotation, this.speed, this.sprite.body.velocity);
            }

        }

        if(this.stress > 1000){
            this.playerLoss();
        }

        this.sprite.rotation = this.waitingGameApp.gameInstance.physics.arcade.angleToPointer(this.sprite);

        this.stressEmitter.x = this.sprite.x;
        this.stressEmitter.y = this.sprite.y;
        this.stress += 0.1;

        if(this.stressEmitter.frequency > 80)
            this.stressEmitter.frequency -= this.stress/100;

    },
    playerHitPatron: function(patronObj){

    },
    playerHitServer: function(serverObj){

    },
    playerHitStation: function(stationObj){

    },
    playerLoss : function(){
        alert('lose.');
    }
  };

  return Player;

});