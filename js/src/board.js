define(['lodash', 'player', 'mosPlayerTypes', 'story', 'mosStoryTypes'], function(_, Player, PlayerTypes, Story, StoryTypes){
    var Board = function(MastersOfScrumApp, rows, columns, gameLength, targetPoints){
        this.mastersOfScrumApp = MastersOfScrumApp;
        this.bugs = [];
        this.stories = [];
        this.qaPlayer = new Player(MastersOfScrumApp, PlayerTypes.QA, 'userA');
        this.redPlayer = new Player(MastersOfScrumApp, PlayerTypes.BackendDev, 'userB');
        this.yellowPlayer = new Player(MastersOfScrumApp, PlayerTypes.ServiceDev, 'userC');
        this.bluePlayer = new Player(MastersOfScrumApp, PlayerTypes.UX, 'userD');
        this.scrumMaster = new Player(MastersOfScrumApp, PlayerTypes.ScrumMaster, 'userE');
        this.players = [this.qaPlayer, this.redPlayer, this.yellowPlayer, this.bluePlayer, this.scrumMaster];
        this.gameLength = gameLength;
        this.maxGameLength = gameLength;
        this.targetPoints = targetPoints;

        //Sprites
        this.endTurnSprite = MastersOfScrumApp.gameInstance.add.sprite(400, 10, 'hourglass');
        this.endTurnSprite.inputEnabled = true;
        this.endTurnSprite.events.onInputDown.add(this.endTurn, this);

        this.activeCursorSprite = MastersOfScrumApp.gameInstance.add.sprite(-400, -10, 'activeCursor');
        this.activeCursorSprite.anchor.setTo(0.5);
        this.activeCursorSprite.bounce=this.mastersOfScrumApp.gameInstance.add.tween(this.activeCursorSprite.scale)
            .to({x: 1.2, y: 1.2}, 1000, Phaser.Easing.Linear.None)
            .to({x:1, y:1}, 1000, Phaser.Easing.Linear.None)
            .loop();
        this.activeCursorSprite.bounce.start();

        //Turn tracker
        this.turnText = MastersOfScrumApp.gameInstance.add.text(800, 20, this.getTurnString());
        this.turnText.anchor.setTo(0.5);
        this.turnText.font = 'Press Start 2P';
        this.turnText.fontSize = 14;
        this.turnText.fill = '#FFFFFF';
        this.turnText.align = 'center';
        this.turnText.stroke = '#000000';
        this.turnText.strokeThickness = 2;
        this.turnText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

        this.turnText.bounce=this.mastersOfScrumApp.gameInstance.add.tween(this.turnText);
        this.turnText.bounce.to({ x: this.mastersOfScrumApp.gameInstance.world.width/3 }, 3000, Phaser.Easing.Bounce.Out);
        this.turnText.bounce.start();
        
        //Stories
        for(var i=0; i<rows; i++){
            for(var j=0; j<columns; j++){
                this.stories.push(new Story(this.mastersOfScrumApp, this.getRandomStoryType(), this.getRandomFib(), 400+(400 * i), 200+(400 * j)));
            }
        }
    };

    Board.prototype = {
        update: function(){
            _.each(this.players, function(player){
                player.update();
            });
            _.each(this.bugs, function(bug){
                bug.update();
            });
            _.each(this.stories, function(story){
                story.update();
            });
            _.each(this.connections, function(connection){
                connection.update();
            });
        },
        reset: function(){
            console.log('reset board');
            //generate and place stories
            //reset character positions & stats
            _.each(this.players, function(player){
                player.sprite.x = 50;
                player.sprite.y = player.playerSettings.startY;
                player.moves = player.playerSettings.maxMoves;
                player.stress = player.playerSettings.maxStress;
            });
            //set redDev to active
            this.setActivePlayer(this.players[0]);
        },
        endTurn: function(){
            //check victory
            if(this.gameLength === 0){
                var points = 0;
                _.each(this.stories, function(story){
                    story.connections.length > 0 ? points += story.maxDifficulty : points += 0;
                }, this);

                if(points >= this.targetPoints){
                    return this.mastersOfScrumApp.runVictory();
                }
                else{
                    return this.mastersOfScrumApp.runLoss();
                }
            }
            //bug combat
            //reduce story values
            _.each(this.stories, function(story){
                var playerReductionTotal = _.reduce(this.players, function(result, player){
                    if(player.activeStory === story){
                        result += 2;
                    }
                    return result;
                }, 0, this);
                if(playerReductionTotal)
                    story.setDifficulty(story.difficulty -= playerReductionTotal);
            }, this);
            //random event
            //set first player to active
            this.setActivePlayer(this.players[0]);
            //reset character stats
            _.each(this.players, function(player){
                player.moves = player.maxMoves;
                player.stress = player.maxStress;
            });
            //decrement turns
            this.gameLength--;
            this.turnText.text = this.getTurnString();
        },
        setActivePlayer: function(playerObj){
            _.each(this.players, function(player){
                player.isActive = false;
            });
            if(playerObj){
                playerObj.isActive = true;
                this.mastersOfScrumApp.gameInstance.camera.follow(playerObj.sprite);
            }
            else{
                this.mastersOfScrumApp.board.activeCursorSprite.x = -40;
                this.mastersOfScrumApp.board.activeCursorSprite.y = -40;
                this.mastersOfScrumApp.gameInstance.camera.unfollow();
            }
        },
        getRandomFib: function(){
            var fibs = [0, 1];
            for(var i=1; i<Math.round(Math.random()*8) + 1; i++){
                fibs.push(fibs[i]+ fibs[i-1]);
            }
            console.log('return story of diff '+fibs[fibs.length-1]);
            return fibs[fibs.length-1];
        },
        getRandomStoryType: function(){
            switch(Math.round(Math.random()*2) + 1){
                case 1:
                    return StoryTypes.Green;
                    break;
                case 2:
                    return StoryTypes.Yellow;
                    break;
                case 3:
                    return StoryTypes.Blue;
                    break;
            }
        },
        getTurnString: function(){
            return 'TURNS REMAINING: ' + this.gameLength + ' / ' +this.maxGameLength;
        }
    };

    return Board;
});