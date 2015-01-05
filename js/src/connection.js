define([], function(){
    var Connection = function(mastersOfScrumApp, sourceStory, targetStory){
        this.sourceStory = sourceStory;
        this.targetStory = targetStory;

        //Graphicx
        this.sprite = mastersOfScrumApp.gameInstance.add.sprite(sourceStory.sprite.x,sourceStory.sprite.y,'/res/connection.png');
        this.sprite.animations.add('sparkle');

        //2D physics
        this.sprite.anchor.set(0.5);
        mastersOfScrumApp.gameInstance.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.immovable = true;
        this.sprite.body.collideWorldBounds = true;

        //Angle == rotation
        this.sprite.angle = (targetStory.sprite.y - sourceStory.sprite.y) / (targetStory.sprite.x - sourceStory.sprite.x);
    };

    Connection.prototype = {
        update: function(){
            //this.sprite.animations.play('sparkle', 20);
        }
    };

    return Connection;
});