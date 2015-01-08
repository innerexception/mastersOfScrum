define(['lodash', 'player', 'mosPlayerTypes', 'story', 'mosStoryTypes'], function(_, Player, PlayerTypes, Story, StoryTypes){
    var Board = function(MastersOfScrumApp, rows, columns, gameLength, targetPoints){
        this.mastersOfScrumApp = MastersOfScrumApp;

        //Sprites
        this.endTurnSprite = MastersOfScrumApp.gameInstance.add.sprite(20, 10, 'hourglass');
        this.endTurnSprite.inputEnabled = true;
        this.endTurnSprite.events.onInputDown.add(this.endTurn, this);

        this.activeCursorSprite = MastersOfScrumApp.gameInstance.add.sprite(-400, -10, 'activeCursor');
        this.activeCursorSprite.anchor.setTo(0.5);
        this.activeCursorSprite.bounce=this.mastersOfScrumApp.gameInstance.add.tween(this.activeCursorSprite.scale)
            .to({x: 1.2, y: 1.2}, 1000, Phaser.Easing.Linear.None)
            .to({x:1, y:1}, 1000, Phaser.Easing.Linear.None)
            .loop();
        this.activeCursorSprite.bounce.start();

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

        //Stories
        //Run planning sequence
        this.planningText = this.getText(0, 180, 'PO: PLANNING BEGINS! (Click to Continue)');
        this.planningText.wordWrap = true;
        this.planningText.wordWrapWidth = 400;
        this.planningText.bounce=this.mastersOfScrumApp.gameInstance.add.tween(this.planningText)
            .to({ x: this.mastersOfScrumApp.gameInstance.world.width/2 - 50}, 2000, Phaser.Easing.Bounce.Out);
        this.planningText.inputEnabled = true;
        this.planningText.events.onInputDown.add(this.getNextText, this);
        this.planningText.bounce.start();
        this.planningText.currentStep = 1;

        this.rows = rows;
        this.columns = columns;

    };

    Board.prototype = {
        spawnStories: function(){
            for(var i=0; i<this.rows; i++){
                var nextX = 0;
                for(var j=0; j<this.columns; j++){
                    nextX = (Math.random()*400) + 200;
                    this.stories.push(new Story(this.mastersOfScrumApp, this.getRandomStoryType(), this.getRandomFib(), 400+(nextX * i), 300+(200 * j)));
                }
            }
        },
        getNextText: function(){
            this.planningText.currentStep++;
            switch(this.planningText.currentStep)    {
                case 2:
                    this.planningText.text = 'PO: THE CLIENT NEEDS AS MUCH OF THIS DONE AS POSSIBLE.';
                    this.planningText.grow = this.mastersOfScrumApp.gameInstance.add.tween(this.planningText.scale)
                        .to({x: 1.2, y:1.2}, 500, Phaser.Easing.Bounce.Out);
                    this.planningText.grow.start();
                    break;
                case 3:
                    this.planningText.text = 'PO: YOUR VELOCITY SHOULD BE AT LEAST 12 POINTS THIS SPRINT.';
                    this.planningText.grow.to({x: 1.2, y: 1.2}, 500, Phaser.Easing.Bounce.Out);
                    this.planningText.grow.start();
                    this.spawnStories();
                    break;
                case 4:
                    this.planningText.text = 'PO: HEAVEN OR HELL, LETS ROCK!';
                    this.planningText.grow.to({x: 3, y: 3}, 500, Phaser.Easing.Bounce.Out)
                        .to({x:0.001, y:0.001}, 500, Phaser.Easing.Bounce.Out);
                    this.planningText.grow.start();
                    this.initTurnTracker();
                    break;
            }
        },
        getText: function(x, y, text){
            var textObj = this.mastersOfScrumApp.gameInstance.add.text(x, y, text);
            textObj.anchor.setTo(0.5);
            textObj.font = 'Press Start 2P';
            textObj.fontSize = 14;
            textObj.fill = '#FFFFFF';
            textObj.align = 'center';
            textObj.stroke = '#000000';
            textObj.strokeThickness = 2;
            textObj.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
            return textObj;
        },
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
                if(playerReductionTotal && story.difficulty != 0)
                    story.setDifficulty(story.difficulty -= playerReductionTotal);
            }, this);
            //random event
            //set first player to active
            this.setActivePlayer(this.players[0]);
            //reset character stats
            _.each(this.players, function(player){
                player.playerSettings.moves = player.playerSettings.maxMoves;
                player.playerSettings.stress = player.playerSettings.maxStress;
            });
            //decrement turns
            this.gameLength--;
            this.turnText.text = this.getTurnString();
        },
        initTurnTracker: function(){
            //Turn tracker
            this.turnText = this.getText(800, 40, this.getTurnString());
            this.turnText.bounce=this.mastersOfScrumApp.gameInstance.add.tween(this.turnText);
            this.turnText.bounce.to({ x: this.mastersOfScrumApp.gameInstance.world.width/3 }, 3000, Phaser.Easing.Bounce.Out);
            this.turnText.bounce.start();
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
            return 'DAYS REMAINING IN SPRINT: ' + this.gameLength + ' / ' +this.maxGameLength;
        }
    };

    return Board;
});