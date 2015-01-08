define(['phaser', 'lodash'], function(Phaser, _){

  var Player = function(mastersOfScrumApp){
      
        this.mastersOfScrumApp = mastersOfScrumApp;

        //Datas
        var x = -50;
        var y = mastersOfScrumApp.gameInstance.world.height/2;

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
        this.sprite.events.onInputOut.add(this.playerMouseOut, this);

        this.sprite.bringToTop();

        this.hitEmitter = mastersOfScrumApp.gameInstance.add.emitter(this.sprite.x, 200, 200);

        this.hitEmitter.makeParticles('smoke');

        this.hitEmitter.setRotation(0, 90);
        this.hitEmitter.setAlpha(0.3, 0.8);
        this.hitEmitter.gravity = 0;

      //	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
        //	The 3000 value is the lifespan of each particle before it's killed
        //this.hitEmitter.start(false, 3000, 1000);

        this.sprite.appear=this.mastersOfScrumApp.gameInstance.add.tween(this.sprite.scale)
          .to({x: 0.5, y:0.5}, 2000, Phaser.Easing.Bounce.Out);
        this.sprite.appear.start();
  };

  Player.prototype = {

    damaged: function(amount){

    },
    playerMouseOver: function(){
        this.mastersOfScrumApp.drawTooltip(this.sprite.x, this.sprite.y-25, 'Incoming bug!');
    },
    playerMouseOut: function(){
        this.mastersOfScrumApp.killTooltip();
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
        }, this);

        this.hitEmitter.x = this.sprite.x;
        this.hitEmitter.y = this.sprite.y;
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