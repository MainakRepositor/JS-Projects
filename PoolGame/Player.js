class Player {
    constructor(name, opponent) {
        this.name = name;
        this.side = false;
        this.remainingBalls = 'all';
        this.eightBallPocket = -1;
        this.getOpponent = () => MAIN.game.players[opponent];
        this.hasFoul = undefined;
    }
    addPoint(number, pocket, side) {
        if (number === 8 && (this.remainingBalls.length > 0 || pocket !== this.eightBallPocket)) {
            console.log('1', number, this.remainingBalls, pocket, this.eightBallPocket);
            this.getOpponent().win('The black ball has been illegally pocketed');
        } else if (pocket === this.eightBallPocket && number == 8 && this.remainingBalls.length === 0) {
            console.log('2', number, this.remainingBalls, pocket, this.eightBallPocket);
            this.win('Every ball has been legaly pocketed');
        }
        if (!this.side) {
            for (let side in Game.balls)
                for (let ball of Game.balls[side]) {
                    document.getElementsByClassName('b' + ball)[0].style.display = 'inline-block';
                    if (ball === number) {
                        this.side = side;
                        this.getOpponent().side = side === 'stripe' ? 'full' : 'stripe';
                    }
                }
            document.querySelector('#' + this.side + 'Balls .name').innerHTML = this.name;
            document.querySelector('#' + this.getOpponent().side + 'Balls .name').innerHTML = this.getOpponent().name;
            this.remainingBalls = Game.balls[this.side];
            this.getOpponent().remainingBalls = Game.balls[this.getOpponent().side];
        }
        if (side === this.side) {
            if (this.hasFoul === undefined) {
                this.hasFoul = false;
            }
            this.eightBallPocket = (pocket + 3) % 6;
        } else {
            this.getOpponent().eightBallPocket = (pocket + 3) % 6;
            this.hasFoul = true;
        }
        document.getElementsByClassName('b' + number)[0].style.display = 'none';
        this.remainingBalls = this.remainingBalls.filter((ballNumber) => ballNumber !== number);
        this.getOpponent().remainingBalls = this.getOpponent().remainingBalls.filter((ballNumber) => ballNumber !== number);


        console.log(pocket, this.eightBallPocket);
        if (this.remainingBalls.length === 0 && !this.eightBallColor)
            this.setEightballColor(this, this.getOpponent());
        if (this.getOpponent().remainingBalls.length === 0 && !this.getOpponent().eightBallColor && this.getOpponent().eightBallPocket !== -1)
            this.setEightballColor(this.getOpponent(), this);
    }

    setEightballColor(player, opponent) {
        if (opponent.eightBallPocket === player.eightBallPocket && opponent.eightBallColor) //zelfde eightball pocket voor beide spelers, en beide spelers hebben geen ballen over
            player.eightBallColor = opponent.eightBallColor;
        else if (!player.eightBallColor)
            player.eightBallColor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);

        document.getElementById(player.side + 'Balls').style.color = player.eightBallColor;
        console.log(player.eightBallPocket);
        MAIN.game.pockets[player.eightBallPocket].mesh.visible = true;
        MAIN.game.pockets[player.eightBallPocket].mesh.material.color = new THREE.Color(player.eightBallColor);
    }

    win(reason = '') {
        MAIN.msg(this.name + ' has won! ' + reason);

        let winnerElement = document.getElementById('imwinner');
        winnerElement.style.transform = 'scale(0.8)';
        winnerElement.style.opacity = 1;

        let player = this;
        MAIN.game.getWinnerImage(this.name).then(function(url) {
            winnerElement.style.backgroundImage = 'url(' + url + ')';

            MAIN.keyHandler.setSingleKey('p', 'Print your trophy and save it as a png file', function() {
                window.open(url).print();
                MAIN.game.saveImage(url, player.name);
            });
            MAIN.keyHandler.setSingleKey('Enter', 'Hide winner image', function() {
                winnerElement.style.display = 'none';
                MAIN.scene.trophyView();
            });
        });
    }
}
