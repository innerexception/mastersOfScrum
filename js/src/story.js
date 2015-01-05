define([], function(){
    var Story = function(mastersOfScrumApp, storyType){

        this.board = mastersOfScrumApp.board;

        //Graphicx
        this.sprite = mastersOfScrumApp.gameInstance.add.sprite(storyType.sprite.x,storyType.sprite.y,'/res/connection.png');
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
            //this.sprite.animations.play('sparkle', 20);
        },
        playerStoryCollide: function(playerObj){
            //Set the player activeStory = this one
            playerObj.activeStory = this;
        }
    };

    return Story;
});