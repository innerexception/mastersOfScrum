define([], function(){
    var Connection = function(sourceStory, targetStory){
        this.sourceStory = sourceStory;
        this.targetStory = targetStory;
    };

    Connection.prototype = {
        update: function(){
        }
    };

    return Connection;
});