define(['lodash'], function(_){
    var Story = function(mastersOfScrumApp, storyType, difficulty, x, y){

        this.mastersOfScrumApp = mastersOfScrumApp;

        this.difficulty = difficulty;

        //Graphicx
        this.sprite = mastersOfScrumApp.gameInstance.add.sprite(x,y,'/res/connection.png');
        this.sprite.animations.add('sparkle');

        //2D physics
        this.sprite.anchor.set(0.5);
        mastersOfScrumApp.gameInstance.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.immovable = true;
        this.sprite.body.collideWorldBounds = true;

        //Angle == rotation
        this.sprite.angle = 0;
    };

    Story.prototype = {
        update: function(){
            _.each(this.mastersOfScrumApp.board.players, function(player){
                this.mastersOfScrumApp.gameInstance.physics.arcade.collide(
                    this.sprite,
                    player.sprite,
                    this.playerStoryCollide,
                    null,
                    this);
            }, this);
        },
        playerStoryCollide: function(storySprite, playerSprite){
            //Set the player activeStory = this one
            var playerObj = _.find(this.mastersOfScrumApp.board.players, function(player){
                return player.sprite === playerSprite;
            });
            playerObj.activeStory = this;
            console.log('story collide!' + playerObj.playerSettings.name);
            //this.sprite.animations.play('sparkle', 20);
        }
    };

    return Story;
});