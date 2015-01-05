require.config({
    baseUrl: 'js',
    paths:{
        'phaser': 'lib/phaser',
        'masterOfScrumApp': 'src/game',
        'player': 'src/player',
        'mosPlayerTypes': 'src/mosPlayerTypes',
        'story': 'src/story',
        'mosStoryTypes': 'src/mosStoryTypes',
        'board': 'src/board',
        'lodash': 'lib/lodash.min'
    },
    shim: {
        'phaser': {
            exports: 'Phaser'
        }
    }
});

require(['phaser', 'masterOfScrumApp'], function(Phaser, MasterOfScrumApp){
    MasterOfScrumApp.init(800, 600, Phaser.AUTO, 'appRoot');
});





