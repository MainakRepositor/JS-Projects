class Main {
    constructor(renderElement) {
        let isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };
        this.isMobile = isMobile.any();

        this.loop = new GameLoop(this.isMobile ? 60 : 120);
        this.keyHandler = new KeyHandler(this.loop);
        this.scene = new Scene(renderElement, this);

        this.styleElement = document.body.appendChild(document.createElement('style'));

        this.katMaterial = new MeshAnimationMaterial({
            directory: 'img/textures/kat',
            side: THREE.FrontSide
        });
        this.setKeymap();
    }

    set style(string) {
        this.styleElement.innerHTML = string;
    }
    get style() {
        return this.styleElement.innerHTML;
    }

    startGame(player1, player2) {
        this.game = new Game(player1, player2);
    }

    setKeymap() {
        let main = this;
        this.keyHandler.setSingleKey(' ', 'Shoot cue', function() {
            main.game.shoot();
        });
        this.keyHandler.setSingleKey('5', 'Top view', function() {
            main.scene.topView();
        });
        this.keyHandler.setSingleKey('6', 'East view', function() {
            main.scene.eastView();
        });
        this.keyHandler.setSingleKey('4', 'West view', function() {
            main.scene.westView();
        });
        this.keyHandler.setSingleKey('2', 'South view', function() {
            main.scene.southView();
        });
        this.keyHandler.setSingleKey('8', 'North view', function() {
            main.scene.northView();
        });
        this.keyHandler.setSingleKey('y', 'Toggle performance statistics', function() {
            main.scene.toggleStats();
        });
        this.keyHandler.setSingleKey('o', 'Pause all loops / play one frame (includes hold keys)', function() {
            clearInterval(MAIN.loop.gameloop);
            MAIN.loop.loop();
        });
        this.keyHandler.setSingleKey('p', 'Resume all loops', function() {
            MAIN.loop.start();
        });
        this.keyHandler.setSingleKey('c', 'Enable aim line', function() {
            main.scene.children = main.scene.children.filter((child) => child.type !== 'Line');
            main.game.cheatLine = !main.game.cheatLine;
        });
        this.keyHandler.setSingleKey('w', 'Place white ball freely', function() {
            main.game.freePlace(main.game.balls.filter((ball) => ball.number === 0)[0]);
        });
        this.keyHandler.setSingleKey('s', 'Switch players', function() {
            main.game.switchPlayers();
        });
        this.keyHandler.setSingleKey('/', 'Show/hide keymap', function() {
            main.showKeyMap();
        });
        this.keyHandler.setSingleKey('n', 'Start new game', function() {
            location.hash = main.game.players[0].name + '//' + main.game.players[1].name;
            location.reload();
        });
        this.keyHandler.setContinuousKey('ArrowLeft', 'Rotate cue left', function() {
            let rotateSpeed = 3 / MAIN.loop.tps;
            rotateSpeed /= MAIN.keyHandler.isPressed('Shift') ? 10 : 1;
            rotateSpeed /= MAIN.keyHandler.isPressed('Control') ? 5 : 1;
            MAIN.scene.cue.rotateY(rotateSpeed);
        });
        this.keyHandler.setContinuousKey('ArrowRight', 'Rotate cue right', function() {
            let rotateSpeed = 3 / MAIN.loop.tps;
            rotateSpeed /= MAIN.keyHandler.isPressed('Shift') ? 10 : 1;
            rotateSpeed /= MAIN.keyHandler.isPressed('Control') ? 5 : 1;
            MAIN.scene.cue.rotateY(-rotateSpeed);
        });
        this.keyHandler.setContinuousKey('ArrowUp', 'Cue power up', function() {
            let powerSpeed = 20 / MAIN.loop.tps;
            powerSpeed /= MAIN.keyHandler.isPressed('Shift') ? 5 : 1;
            powerSpeed /= MAIN.keyHandler.isPressed('Control') ? 5 : 1;
            MAIN.game.cuePower += powerSpeed;
        });
        this.keyHandler.setContinuousKey('ArrowDown', 'Cue power down', function() {
            let powerSpeed = 20 / MAIN.loop.tps;
            powerSpeed /= MAIN.keyHandler.isPressed('Shift') ? 5 : 1;
            powerSpeed /= MAIN.keyHandler.isPressed('Control') ? 5 : 1;
            MAIN.game.cuePower -= powerSpeed;
        });

        document.addEventListener('keydown', function(e) {
            if (this.katKeys === undefined) {
                this.katKeys = '';
            }
            this.katKeys += e.key;
            if (this.katKeys.includes('kat.gif')) {
                this.katKeys = '';
                for (let ball of MAIN.game.balls) {
                    ball.material = MAIN.katMaterial;
                }
                MAIN.scene.tableFloor.mesh.material = MAIN.katMaterial;
                MAIN.katMaterial.toggle();
            }
        }, false);
    }

    showKeyMap() {
        let keyMap = this.keyHandler.keyMap,
            singleKeyElement = document.getElementById('single'),
            continuousKeyElement = document.getElementById('continuous'),
            singleHTML = '<ul>',
            continuousHTML = '<ul>';

        for (let key in keyMap.single)
            singleHTML += `<li>
                        <div class='key'>${key==' '?'Space':key}</div>
                        <div class='bindName'>${keyMap.single[key].name}
                    </li>`;
        singleHTML += '</ul>';

        for (let key in keyMap.continuous)
            continuousHTML += `<li>
                        <div class='key'>${key==' '?'Space':key}</div>
                        <div class='bindName'>${keyMap.continuous[key].name}
                    </li>`;
        continuousHTML += '</ul>';

        singleKeyElement.innerHTML = singleHTML;
        continuousKeyElement.innerHTML = continuousHTML;
        let helpElement = document.getElementById('help');
        if (this.keyDisplay === 'block')
            this.keyDisplay = 'none';
        else
            this.keyDisplay = 'block';
        helpElement.style.display = this.keyDisplay;
    }


    msg(string) {
        let msgBox = document.getElementById('messageBox'),
            progressBar = document.getElementsByTagName('progress')[0],
            cameraButton = document.getElementById('cameraButton');
        msgBox.innerHTML = string;
        msgBox.style.transform = 'translateY(0px)';
        progressBar.style.transform = 'translateY(-60px)';
        cameraButton.style.transform = 'translateY(-60px)';

        if (this.msgTimeout)
            clearTimeout(this.msgTimeout);
        this.msgTimeout = self.setTimeout(function() {
            msgBox.style.transform = 'translateY(60px)';
            progressBar.style.transform = 'translateY(0px)';
            cameraButton.style.transform = 'translateY(0px)';
        }, 3000 + string.length * 100);
    }
}
