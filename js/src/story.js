define(['lodash', 'connection'], function(_, Connection){
    var Story = function(mastersOfScrumApp, storyType, difficulty, x, y){

        this.x = x;
        this.y = y;

        this.mastersOfScrumApp = mastersOfScrumApp;

        this.difficulty = difficulty;
        this.maxDifficulty = difficulty;

        this.connections = [];

        //Graphicx
        this.sprite = mastersOfScrumApp.gameInstance.add.sprite(x,-100,storyType.spritePath);
        //2D physics
        this.sprite.anchor.set(0.5);
        mastersOfScrumApp.gameInstance.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.immovable = true;

        //Angle == rotation
        this.sprite.angle = 0;

        //Tweens
        this.spin=this.mastersOfScrumApp.gameInstance.add.tween(this.sprite)
            .to({angle: 30}, 150, Phaser.Easing.Linear.None)
            .to({angle: -30}, 150, Phaser.Easing.Linear.None)
            .to({angle: 0}, 150, Phaser.Easing.Linear.None);
        this.bounce=this.mastersOfScrumApp.gameInstance.add.tween(this.sprite.scale)
            .to({x: 1.2, y: 1.2}, 150, Phaser.Easing.Linear.None)
            .to({x:1, y:1}, 500, Phaser.Easing.Linear.None);
        this.yellow=this.mastersOfScrumApp.gameInstance.add.tween(this.sprite)
            .to({tint: 0xffff00}, 2000, Phaser.Easing.Linear.None)
            .to({tint: 0xffffff}, 2000, Phaser.Easing.Linear.None)
            .loop();
        this.green=this.mastersOfScrumApp.gameInstance.add.tween(this.sprite)
            .to({tint: 0xffffff}, 2000, Phaser.Easing.Linear.None)
            .to({tint: 0x00ff00}, 2000, Phaser.Easing.Linear.None)
            .loop();
        this.fall=this.mastersOfScrumApp.gameInstance.add.tween(this.sprite)
            .to({y: this.y}, 2000, Phaser.Easing.Bounce.Out);
        this.fall.onComplete.addOnce(this.getDifficultyText, this);
        this.fall.delay(Math.random()*2000).start();
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

            if(this.handle2){
                this.handle2.x = this.mastersOfScrumApp.gameInstance.input.mousePointer.x+this.mastersOfScrumApp.gameInstance.camera.x;
                this.handle2.y = this.mastersOfScrumApp.gameInstance.input.mousePointer.y+this.mastersOfScrumApp.gameInstance.camera.y;
                this.drawLine(this.handle1.x,
                    this.handle1.y,
                    this.handle2.x,
                    this.handle2.y, this.mastersOfScrumApp.gripperContext, true);

                _.each(this.mastersOfScrumApp.board.stories, function(story){
                    this.mastersOfScrumApp.gameInstance.physics.arcade.overlap(
                        story.sprite,
                        this.handle2,
                        this.gripperStoryCollide,
                        null,
                        this);
                }, this);
            }
            //this.sprite.x+(this.sprite.width/2), this.sprite.y
            _.each(this.connections, function(connection){
                this.drawLine(connection.sourceStory.sprite.x, connection.sourceStory.sprite.y, connection.targetStory.sprite.x, connection.targetStory.sprite.y, this.mastersOfScrumApp.connectionContext);
            }, this);

        },
        getDifficultyText: function(){
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
        },
        setDifficulty: function(value){
            //Render current difficulty value
            this.difficulty = value < 0 ? 0 : value;
            this.difficultyText.text = this.difficulty;
            this.difficultyText.bounce
                .to({ fontSize: 24 }, 1000, Phaser.Easing.Linear.None)
                .to({ fontSize: 12 }, 1000, Phaser.Easing.Bounce.Out);
            this.difficultyText.bounce.start();
            if(this.difficulty === 0){
                //Spin card to yellow state
                this.spin.start();
                this.yellow.start();
            }
            else{
                this.yellow.stop();
            }
        },
        gripperStoryCollide: function(storySprite, gripperSprite){
            //Set target of new connection to the story obj
            var storyObj = _.find(this.mastersOfScrumApp.board.stories, function(story){
                return story.sprite === storySprite;
            });
            console.log('gripper hit story' + storyObj);

            this.newConnection = new Connection(this, storyObj);
        },
        gripperStorySave: function(){
            var newConnection = new Connection(this.newConnection.sourceStory, this.newConnection.targetStory);
            this.connections.push(newConnection);
            this.newConnection.targetStory.connections.push(newConnection);
            this.newConnection = null;
            this.endPathBuilder();
        },
        playerStoryCollide: function(storySprite, playerSprite){
            //Set the player activeStory = this one
            var playerObj = _.find(this.mastersOfScrumApp.board.players, function(player){
                return player.sprite === playerSprite;
            });
            console.log('story collide!' + playerObj.playerSettings.name);
            //Check if too many players
            //Move players already on card over
            var existingPlayers = _.filter(this.mastersOfScrumApp.board.players, function(player){
                return player.activeStory === this;
            }, this);

            var that = this;
            var tweenPlayer = false;
            if(playerObj.playerSettings.name==='SCRUM'){
                this.mastersOfScrumApp.drawTooltip(playerObj.avatarSprite.x, playerObj.avatarSprite.y+35, 'SCRUM master dont work on cards son!');
                window.setTimeout(function(){
                    that.mastersOfScrumApp.killTooltip();
                }, 3000);
            }
            else if(playerObj.playerSettings.name==='QA' && this.difficulty != 0) {
                this.mastersOfScrumApp.drawTooltip(playerObj.avatarSprite.x, playerObj.avatarSprite.y+35, 'This card is not ready for QA!');
                window.setTimeout(function(){
                    that.mastersOfScrumApp.killTooltip();
                }, 3000);
            }
            else if(playerObj.playerSettings.name === 'QA' && this.difficulty === 0){
                tweenPlayer = true;
                if(!this.handle2){
                    //Set to green, enter path laying mode
                    //this.yellow.pause();
                    //this.green.start();
                    this.startPathBuilder();
                }
            }
            else if(existingPlayers.length < 2){
                //Only devs can have active stories
                playerObj.activeStory = this;
                tweenPlayer = true;
            }
            else if(existingPlayers.length >= 2){
                this.mastersOfScrumApp.drawTooltip(playerObj.avatarSprite.x, playerObj.avatarSprite.y+35, 'Too many people on this card!');
                window.setTimeout(function(){
                    that.mastersOfScrumApp.killTooltip();
                }, 3000);
            }

            if(tweenPlayer){
                //Tween player onto story card
                _.each(existingPlayers, function(player){
                    var tempTween = this.mastersOfScrumApp.gameInstance.add.tween(player.sprite);
                    tempTween.to({x:this.sprite.x-(32+(existingPlayers.length*10)), angle:0}, 1000, Phaser.Easing.Bounce.Out);
                    tempTween.start();
                }, this);
                this.mastersOfScrumApp.board.setActivePlayer(null);
                playerObj.sprite.bringToTop();
                playerObj.avatarSprite.bringToTop();
                this.mastersOfScrumApp.playerTween = this.mastersOfScrumApp.gameInstance.add.tween(playerObj.sprite);
                this.mastersOfScrumApp.playerTween.to({x:this.sprite.x, y:this.sprite.y-10, angle:0}, 3000, Phaser.Easing.Bounce.Out);
                this.mastersOfScrumApp.playerTween.start();

                this.bounce.start();
            }

        },
        startPathBuilder: function(){
            this.handle1 = this.mastersOfScrumApp.gameInstance.add.sprite(this.sprite.x+(this.sprite.width/2), this.sprite.y, 'gripper');
            this.handle1.anchor.set(0.5);

            this.handle2 = this.mastersOfScrumApp.gameInstance.add.sprite(this.mastersOfScrumApp.gameInstance.input.mousePointer.x, this.mastersOfScrumApp.gameInstance.input.mousePointer.y, 'gripper');
            this.handle2.anchor.set(0.5);
            this.handle2.inputEnabled = true;
            this.handle2.events.onInputDown.add(this.gripperStorySave, this);
            this.mastersOfScrumApp.gameInstance.physics.enable(this.handle2, Phaser.Physics.ARCADE);
            this.handle2.body.collideWorldBounds = true;

        },
        endPathBuilder: function(){
            this.handle1.destroy();
            delete this.handle1;
            this.handle2.destroy();
            delete this.handle2;
            this.mastersOfScrumApp.gripperContext.clear();
        },
        drawLine: function(x1, y1, x2, y2, context, clear){
            if(clear) context.clear();
            context.lineStyle(3, 0xff0000, 0.5);
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
        },
        destroy: function(){
            this.mastersOfScrumApp.gripperContext.destroy();
            this.mastersOfScrumApp.connectionContext.destroy();
            //Graphicx
            this.sprite.destroy();
            this.difficultyText.destroy();
        }
    };

    return Story;
});