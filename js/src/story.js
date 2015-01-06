define(['lodash'], function(_){
    var Story = function(mastersOfScrumApp, storyType, difficulty, x, y){

        this.mastersOfScrumApp = mastersOfScrumApp;

        this.difficulty = difficulty;

        //Graphicx
        this.sprite = mastersOfScrumApp.gameInstance.add.sprite(x,y,storyType.spritePath);
        this.sprite.animations.add('sparkle');

        //2D physics
        this.sprite.anchor.set(0.5);
        mastersOfScrumApp.gameInstance.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.immovable = true;
        this.sprite.body.collideWorldBounds = true;

        //Angle == rotation
        this.sprite.angle = 0;

        this.difficultyText = this.mastersOfScrumApp.gameInstance.add.text(this.sprite.x+(this.sprite.width/2)-15, this.sprite.y+(this.sprite.height/2)-15, this.difficulty);
        this.difficultyText.anchor.setTo(0.5);
        this.difficultyText.font = 'Press Start 2P';
        this.difficultyText.fontSize = 12;
        this.difficultyText.fill = '#FFFFFF';
        this.difficultyText.align = 'center';
        this.difficultyText.stroke = '#000000';
        this.difficultyText.strokeThickness = 2;
        this.difficultyText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
        this.difficultyText.bounce=this.mastersOfScrumApp.gameInstance.add.tween(this.difficultyText)
            .to({ fontSize: 24 }, 1000, Phaser.Easing.Linear.None)
            .to({ fontSize: 12 }, 1000, Phaser.Easing.Bounce.Out);
        this.difficultyText.bounce.start();
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
        setDifficulty: function(value){
            //Render current difficulty value
            this.difficulty = value;
            this.difficultyText.text = value;
            this.difficultyText.bounce
                .to({ fontSize: 24 }, 1000, Phaser.Easing.Linear.None)
                .to({ fontSize: 12 }, 1000, Phaser.Easing.Bounce.Out);
            this.difficultyText.bounce.start();
        },
        playerStoryCollide: function(storySprite, playerSprite){
            //Set the player activeStory = this one
            var playerObj = _.find(this.mastersOfScrumApp.board.players, function(player){
                return player.sprite === playerSprite;
            });
            console.log('story collide!' + playerObj.playerSettings.name);
            //Move players already on card over
            var existingPlayers = _.filter(this.mastersOfScrumApp.board.players, function(player){
                return player.activeStory === this;
            }, this);
            _.each(existingPlayers, function(player){
                var tempTween = this.mastersOfScrumApp.gameInstance.add.tween(player.sprite);
                tempTween.to({x:this.sprite.x-64, angle:0}, 1000, Phaser.Easing.Bounce.Out);
                tempTween.start();
            }, this);
            //Tween player onto story card
            playerObj.activeStory = this;
            playerObj.isActive = false;
            playerObj.sprite.bringToTop();
            playerObj.avatarSprite.bringToTop();
            this.mastersOfScrumApp.playerTween = this.mastersOfScrumApp.gameInstance.add.tween(playerObj.sprite);
            this.mastersOfScrumApp.playerTween.to({x:this.sprite.x, y:this.sprite.y-10, angle:0}, 3000, Phaser.Easing.Bounce.Out);
            this.mastersOfScrumApp.playerTween.start();
        }
    };

    return Story;
});