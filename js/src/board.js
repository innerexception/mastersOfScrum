define(['lodash', 'player', 'mosPlayerTypes', 'story', 'mosStoryTypes'], function(_, Player, PlayerTypes, Story, StoryTypes){
    var Board = function(MastersOfScrumApp, rows, columns){
        this.mastersOfScrumApp = MastersOfScrumApp;
        this.bugs = [];
        this.stories = [];
        this.qaPlayer = new Player(MastersOfScrumApp, PlayerTypes.QA, 'userA');
        this.redPlayer = new Player(MastersOfScrumApp, PlayerTypes.BackendDev, 'userB');
        this.yellowPlayer = new Player(MastersOfScrumApp, PlayerTypes.ServiceDev, 'userC');
        this.bluePlayer = new Player(MastersOfScrumApp, PlayerTypes.UX, 'userD');
        this.scrumMaster = new Player(MastersOfScrumApp, PlayerTypes.ScrumMaster, 'userE');
        this.players = [this.qaPlayer, this.redPlayer, this.yellowPlayer, this.bluePlayer, this.scrumMaster];

        //Sprites
        this.endTurnSprite = MastersOfScrumApp.gameInstance.add.sprite(400, 10, 'hourglass');
        this.endTurnSprite.inputEnabled = true;
        this.endTurnSprite.events.onInputDown.add(this.endTurn, this);

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
        },
        setActivePlayer: function(playerObj){
            if(playerObj){
                _.each(this.players, function(player){
                    player.isActive = false;
                });
                playerObj.isActive = true;
                this.mastersOfScrumApp.gameInstance.camera.follow(playerObj.sprite);
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
        }
    };

    return Board;
});