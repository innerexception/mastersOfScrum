define(['phaser', 'lodash'], function(Phaser, _){

  var Player = function(mastersOfScrumApp, x, y){
      
        this.mastersOfScrumApp = mastersOfScrumApp;

        //Datas
        this.hp = 50;

        //Graphicx
        this.sprite = mastersOfScrumApp.gameInstance.add.sprite(x,y,'bug');
        this.sprite.scale.x = 0.0001;
        this.sprite.scale.y = 0.0001;
        //2D physics
        this.sprite.anchor.set(0.5);
        mastersOfScrumApp.gameInstance.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.immovable = false;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.drag.set(1);
        this.sprite.body.maxVelocity.setTo(400,400);
        //1 == full rebound on collision
        this.sprite.body.bounce.setTo(0.8,0.8);
        //Angle == rotation
        this.sprite.angle = mastersOfScrumApp.gameInstance.rnd.angle();
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputOver.add(this.playerMouseOver, this);

        this.sprite.bringToTop();

        this.hitEmitter = mastersOfScrumApp.gameInstance.add.emitter(this.sprite.x, 200, 200);

        this.hitEmitter.makeParticles('smoke');

        this.hitEmitter.setRotation(0, 90);
        this.hitEmitter.setAlpha(0.3, 0.8);
        this.hitEmitter.gravity = 0;

        this.mastersOfScrumApp.board.hasActiveBugs++;
        if(this.mastersOfScrumApp.board.hasActiveBugs === 1){
            //Draw bug warning
            this.mastersOfScrumApp.drawBannerMessage('BUG ALERT! EVERYONE KILL IT!', 32, 3000);
        }

      _.each(this.mastersOfScrumApp.board.players, function(player){
          player.drawAmmoMeter();
      }, this);

      //	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
        //	The 3000 value is the lifespan of each particle before it's killed
        //this.hitEmitter.start(false, 3000, 1000);

        this.sprite.appear=this.mastersOfScrumApp.gameInstance.add.tween(this.sprite.scale)
          .to({x: 0.3, y:0.3}, 2000, Phaser.Easing.Bounce.Out);
        this.sprite.appear.start();
  };

  Player.prototype = {

    playerMouseOver: function(){
        this.mastersOfScrumApp.drawTooltip(this.sprite.x, this.sprite.y-25, 'Incoming bug!');
    },
    update: function(){
        if(this.mastersOfScrumApp.board.isReady){
            this.sprite.angle = this.mastersOfScrumApp.gameInstance.physics.arcade.accelerateToObject(this.sprite, this.mastersOfScrumApp.activePlayer.sprite);
        }

        //If collide with other player, damage them
        _.each(this.mastersOfScrumApp.board.players, function(player){
            this.mastersOfScrumApp.gameInstance.physics.arcade.collide(
                this.sprite,
                player.avatarSprite,
                this.bugPlayerCollide,
                null,
                this);

            this.mastersOfScrumApp.gameInstance.physics.arcade.overlap(
                this.sprite,
                player.bullets,
                this.bugBulletCollide,
                null,
                this);

        }, this);

        this.hitEmitter.x = this.sprite.x;
        this.hitEmitter.y = this.sprite.y;
    },

    bugBulletCollide: function(bugSprite, bulletSprite){
        //Take damage, destroy if necessary
        this.hp -= 20;
        if(this.hp <= 0){
            this.sprite.kill();
            this.sprite.visible = false;
            this.mastersOfScrumApp.board.hasActiveBugs--;
            if(this.mastersOfScrumApp.board.hasActiveBugs === 0){
                this.mastersOfScrumApp.drawBannerMessage('Nice job people, back to work.', 24, 3000);
            }
            this.mastersOfScrumApp.board.hasActiveBugs = Math.max(0,this.mastersOfScrumApp.board.hasActiveBugs);
            _.each(this.mastersOfScrumApp.board.players, function(player){
                player.drawAmmoMeter();
            }, this);
        }
        this.hitEmitter.start(true, 1000, null, 5);
        bulletSprite.kill();
        bulletSprite.visible = false;
    },

    bugPlayerCollide: function(bugSprite, playerSprite) {
      var playerObj = _.find(this.mastersOfScrumApp.board.players, function (player) {
          return player.avatarSprite === playerSprite;
      });
      playerObj.removeMoves();
    },

    destroy: function(){

        //Graphicx
        this.sprite.destroy();

        //stress
        this.hitEmitter.destroy();
    }
  };

  return Player;

});