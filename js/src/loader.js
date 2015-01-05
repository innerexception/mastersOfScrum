require.config({
    baseUrl: 'js',
    paths:{
        'phaser': 'lib/phaser',
        'waitingGameApp': 'src/game',
        'player': 'src/player',
        'restaurant': 'src/restaurant',
        'lodash': 'lib/lodash.min'
    },
    shim: {
        'phaser': {
            exports: 'Phaser'
        }
    }
})

require(['phaser', 'waitingGameApp'], function(Phaser, WaitingGameApp){
    WaitingGameApp.init(640, 480, Phaser.AUTO, 'appRoot');
});





