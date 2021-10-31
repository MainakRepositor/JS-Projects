document.addEventListener('DOMContentLoaded', init, false);

function init() {
    MAIN = new Main(document.getElementById('renderView'));

    let users = location.hash.substr(1).split('//');
    if (users.length === 2)
        newGame(users[0], users[1]);
}

function timeGameLoop() {
    clearInterval(MAIN.loop.gameloop);
    time(function(){
        MAIN.loop.loop();
    }, 100);
    MAIN.loop.start();
}

function newGame(n1, n2) {
    do{
        var name1 = n1 || prompt('Player 1 name?', 'Player 1'),
            name2 = n2 || prompt('Player 2 name?', 'Player 2');
    }while(name1.includes('//') || name2.includes('//'));

    name1 = name1.substr(0, 1).toUpperCase() + name1.substr(1);
    name2 = name2.substr(0, 1).toUpperCase() + name2.substr(1);

    let menu = document.getElementById('menu'),
        players = document.getElementById('players');

    players.style.transform = 'scale(1) translateY(0px)';
    menu.style.width = '50%';
    menu.style.transform = 'translateX(-100%)';
    menu.style.pointerEvents = 'none';
    menu.style.opacity = 0;

    setTimeout(function() {
        MAIN.startGame(name1, name2);
    }, 300);
}

function time(fun, trials = 10000000) {
    let now = performance.now();
    for (let i = 0; i < trials; i++) {
        fun();
    }
    let time = (performance.now() - now) / trials,
        unit = 'milliseconds';
    if (time < 1) {
        time *= 1000;
        unit = 'microseconds';
    }
    if (time < 1) {
        time *= 1000;
        unit = 'nanoseconds';
    }
    console.log('average: ', time, unit);
}
