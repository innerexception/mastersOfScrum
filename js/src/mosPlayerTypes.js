define([], function(){

    var PlayerTypes = {};


    PlayerTypes.QA = {
        name: 'QA',
        stress : 150,
        maxStress : 150,
        maxMoves : 1,
        moves: 1,
        attack : 1,
        detectionModifyer: 2,
        bugModifyer : 0,
        spritePath: '/res/sprite/qa.png',
        startY: 100
    };

    PlayerTypes.UX = {
        name: 'QA',
        stress : 100,
        maxStress : 100,
        moves : 0,
        maxMoves : 0,
        attack : 1,
        bugModifyer : 1,
        storyBonus : 'blue',
        spritePath: '/res/sprite/ux.png',
        startY: 200
    };

    PlayerTypes.ServiceDev = {
        name: 'SVC',
        stress : 100,
        maxStress : 100,
        moves : 0,
        maxMoves : 0,
        attack : 1,
        bugModifyer : 1,
        storyBonus : 'yellow',
        spritePath: '/res/sprite/svc.png',
        startY: 300
    };

    PlayerTypes.BackendDev = {
        name: 'SQL',
        stress : 100,
        maxStress : 100,
        moves : 100,
        maxMoves : 100,
        attack : 1,
        bugModifyer : 1,
        storyBonus : 'red',
        spritePath: '/res/sprite/sql.png',
        startY: 400
    };

    PlayerTypes.ScrumMaster = {
        name: 'SCRUM',
        stress : 50,
        maxStress : 50,
        moves : 2,
        maxMoves : 2,
        attack : 0,
        bugModifyer : 0,
        spritePath: '/res/sprite/scrum.png',
        startY: 500
    };

    return PlayerTypes;
});