define([], function(){

    var PlayerTypes = {};


    PlayerTypes.QA = {
        name: 'QA',
        stress : 150,
        moves : 1,
        attack : 1,
        detectionModifyer: 2,
        bugModifyer : 0,
        spritePath: '/res/sprite/qa.png',
        startY: 100
    };

    PlayerTypes.UX = {
        name: 'QA',
        stress : 100,
        moves : 0,
        attack : 1,
        bugModifyer : 1,
        storyBonus : 'blue',
        spritePath: '/res/sprite/ux.png',
        startY: 200
    };

    PlayerTypes.ServiceDev = {
        name: 'SVC',
        stress : 100,
        moves : 0,
        attack : 1,
        bugModifyer : 1,
        storyBonus : 'yellow',
        spritePath: '/res/sprite/svc.png',
        startY: 300
    };

    PlayerTypes.BackendDev = {
        name: 'SQL',
        stress : 100,
        moves : 0,
        attack : 1,
        bugModifyer : 1,
        storyBonus : 'red',
        spritePath: '/res/sprite/sql.png',
        startY: 400
    };

    PlayerTypes.ScrumMaster = {
        name: 'SCRUM',
        stress : 50,
        moves : 2,
        attack : 0,
        bugModifyer : 0,
        spritePath: '/res/sprite/scrum.png',
        startY: 500
    };

    return PlayerTypes;
});