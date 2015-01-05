define(['lodash', 'player', 'mosPlayerTypes'], function(_, Player, PlayerTypes){
    var Board = function(MastersOfScrumApp){
        this.bugs = [];
        this.stories = [];
        this.connections = [];
        this.qaPlayer = new Player(MastersOfScrumApp, PlayerTypes.QA);
        this.redPlayer = new Player(MastersOfScrumApp, PlayerTypes.BackendDev);
        this.yellowPlayer = new Player(MastersOfScrumApp, PlayerTypes.ServiceDev);
        this.bluePlayer = new Player(MastersOfScrumApp, PlayerTypes.UX);
        this.scrumMaster = new Player(MastersOfScrumApp, PlayerTypes.ScrumMaster);
        this.players = [this.qaPlayer, this.redPlayer, this.yellowPlayer, this.bluePlayer, this.scrumMaster];

        //Sprites
        this.sprite = MastersOfScrumApp.gameInstance.add.sprite(50,50, '/res/sprite/board.png');
        this.endTurnSprite = MastersOfScrumApp.gameInstance.add.sprite(25, 25, '/res/sprite/endturn.png');
        //this.endTurnSprite.onclick = this.endTurn();
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
            //reset character positions
            //set redDev to active
        },
        endTurn: function(){
            //check victory
            //bug combat
            //reduce story values
            //random event
            //set redDev to active
        }
    };

    return Board;
});