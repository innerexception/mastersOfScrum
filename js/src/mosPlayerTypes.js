define([], function(){

    var PlayerTypes = {};


    PlayerTypes.QA = {
        name: 'QA',
        stress : 150,
        maxStress : 150,
        maxMoves : 50,
        moves: 50,
        attack : 1,
        detectionModifyer: 2,
        bugModifyer : 0,
        spritePath: 'redPlayer',
        startY: 200
    };

    PlayerTypes.UX = {
        name: 'UX Dev',
        stress : 100,
        maxStress : 100,
        moves : 0,
        maxMoves : 25,
        attack : 1,
        bugModifyer : 1,
        storyBonus : 'blue',
        spritePath: 'bluePlayer',
        startY: 275
    };

    PlayerTypes.ServiceDev = {
        name: 'SVC Dev',
        stress : 100,
        maxStress : 100,
        moves : 0,
        maxMoves : 25,
        attack : 1,
        bugModifyer : 1,
        storyBonus : 'yellow',
        spritePath: 'yellowPlayer',
        startY: 350
    };

    PlayerTypes.BackendDev = {
        name: 'SQL Dev',
        stress : 100,
        maxStress : 100,
        moves : 0,
        maxMoves : 25,
        attack : 1,
        bugModifyer : 1,
        storyBonus : 'red',
        spritePath: 'greenPlayer',
        startY: 425
    };

    PlayerTypes.ScrumMaster = {
        name: 'SCRUM',
        stress : 50,
        maxStress : 50,
        moves : 50,
        maxMoves : 50,
        attack : 0,
        bugModifyer : 0,
        spritePath: 'babyBluePlayer',
        startY: 500
    };

    return PlayerTypes;
});