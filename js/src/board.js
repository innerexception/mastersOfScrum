define(['lodash', 'player', 'mosPlayerTypes', 'story', 'mosStoryTypes', 'bug'], function(_, Player, PlayerTypes, Story, StoryTypes, Bug){
    var Board = function(MastersOfScrumApp, rows, columns, gameLength, targetPoints){
        this.mastersOfScrumApp = MastersOfScrumApp;
        this.hasActiveBugs = 0;
        //Sprites
        this.endTurnSprite = MastersOfScrumApp.gameInstance.add.sprite(-15, 60, 'hourglass');
        this.endTurnSprite.inputEnabled = true;
        this.endTurnSprite.anchor.setTo(0.5);
        this.endTurnSprite.events.onInputDown.add(this.endTurn, this);
        this.endTurnSprite.events.onInputOver.add(this.endTurnMouseOver, this);
        this.endTurnSprite.events.onInputOut.add(this.endTurnMouseOut, this);
        this.endTurnSprite.bounce=this.mastersOfScrumApp.gameInstance.add.tween(this.endTurnSprite)
            .to({ x: 50}, 2000, Phaser.Easing.Bounce.Out);
        this.endTurnSprite.bounce.start();

        this.arrowSprite = this.mastersOfScrumApp.gameInstance.add.sprite(-100, -100, 'target');
        this.arrowSprite.anchor.setTo(0.5);

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
        this.currentStep = 1;
        this.mastersOfScrumApp.drawBannerMessage('PO: PLANNING BEGINS!', 24, 3000, this.getNextText, this);
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
            this.currentStep++;
            switch(this.currentStep)    {
                case 2:
                    this.mastersOfScrumApp.drawBannerMessage('PO: THE CLIENT NEEDS AS MUCH OF THIS DONE AS POSSIBLE.', 24, 3000, this.getNextText, this);
                    break;
                case 3:
                    this.mastersOfScrumApp.drawBannerMessage('PO: YOUR VELOCITY SHOULD BE AT LEAST '+this.targetPoints+' POINTS THIS SPRINT.', 24, 3000, this.getNextText, this);
                    this.spawnStories();
                    break;
                case 4:
                    this.mastersOfScrumApp.drawBannerMessage('PO: HEAVEN OR HELL, LETS ROCK!', 48, 1000, this.getNextText, this);
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
                    story.connections.length > 0 && story.difficulty === 0 ? points += story.maxDifficulty : points += 0;
                }, this);

                if(points >= this.targetPoints){
                    return this.mastersOfScrumApp.runVictory();
                }
                else{
                    return this.mastersOfScrumApp.runLoss();
                }
            }

            //reduce story values
            _.each(this.stories, function(story){
                var playerMaxBugChance = 0;
                var playerReductionTotal = _.reduce(this.players, function(result, player){
                    if(player.activeStory === story){
                        result += 2;
                    }
                    if(player.playerSettings.bugChance)
                        playerMaxBugChance = Math.max(player.playerSettings.bugChance, playerMaxBugChance);
                    return result;
                }, 0, this);
                if(playerReductionTotal && story.difficulty != 0)
                    story.setDifficulty(story.difficulty -= playerReductionTotal);
                //bug spawns
                if(Math.round((Math.random()*100)) < playerMaxBugChance) this.bugs.push(new Bug(this.mastersOfScrumApp, story.sprite.x, story.sprite.y));
            }, this);
            //random events

            //reset character stats
            this.scrumMaster.playerSettings.moves = this.scrumMaster.playerSettings.maxMoves;

            this.redPlayer.playerSettings.moves = 5;
            this.yellowPlayer.playerSettings.moves = 5;
            this.bluePlayer.playerSettings.moves = 5;

            //decrement turns
            this.gameLength--;
            this.turnText.text = this.getTurnString();
        },
        endTurnMouseOver: function(){
            this.endTurnSprite.mouseBump=this.mastersOfScrumApp.gameInstance.add.tween(this.endTurnSprite.scale)
                .to({x:1.2, y:1.2}, 100, Phaser.Easing.Linear.None);
            this.endTurnSprite.mouseBump.start();
            this.mastersOfScrumApp.drawTooltip(this.endTurnSprite.x, this.endTurnSprite.y-25, 'End the Day');
        },
        endTurnMouseOut: function(){
            this.endTurnSprite.mouseBump=this.mastersOfScrumApp.gameInstance.add.tween(this.endTurnSprite.scale)
                .to({x:1, y:1}, 100, Phaser.Easing.Linear.None);
            this.endTurnSprite.mouseBump.start();
            this.mastersOfScrumApp.killTooltip();
        },
        initTurnTracker: function(){
            //Turn tracker
            this.turnText = this.getText(800, 60, this.getTurnString());
            this.turnText.bounce=this.mastersOfScrumApp.gameInstance.add.tween(this.turnText);
            this.turnText.bounce.to({ x: this.mastersOfScrumApp.gameInstance.world.width/4 }, 3000, Phaser.Easing.Bounce.Out);
            this.turnText.bounce.start();
            this.isReady = true;
        },
        setActivePlayer: function(playerObj){
            _.each(this.players, function(player){
                player.isActive = false;
            });
            if(playerObj){
                playerObj.isActive = true;
                this.mastersOfScrumApp.activePlayer = playerObj;
                this.mastersOfScrumApp.gameInstance.camera.follow(playerObj.sprite);
                playerObj.drawAmmoMeter();
            }
            else{
                this.activeCursorSprite.x = -40;
                this.activeCursorSprite.y = -40;
                this.arrowSprite.scale.x = 0.0001;
                this.arrowSprite.scale.y = 0.0001;
                this.activeCursorSprite.bringToTop();
                this.arrowSprite.bringToTop();
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
        },
        destroy: function(){
            this.mastersOfScrumApp = null;

            //Sprites
            this.endTurnSprite.destroy();
            this.activeCursorSprite.destroy();
            _.each(this.bugs, function(bug){
                bug.destroy();
            }, this);
            _.each(this.stories, function(story){
                story.destroy();
            }, this);
            this.qaPlayer.destroy();
            this.redPlayer.destroy();
            this.yellowPlayer.destroy();
            this.bluePlayer.destroy();
            this.scrumMaster.destroy();
            this.players = null;

            this.planningText.destroy();

        }
    };

    return Board;
});