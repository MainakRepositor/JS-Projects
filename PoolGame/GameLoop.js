class GameLoop {
    constructor(tps) {
        this.tps = tps;
        this.functions = {
            0: function() {}
        };
        this.amount = 1;
        this.start();
        this.time = performance.now();
    }
    add(fun) {
        this.functions[this.amount] = fun;
        return this.amount++;
    }
    remove(funIndex) {
        delete this.functions[funIndex];
        return false;
    }
    start(){
        let gameLoop = this;
        this.gameloop = self.setInterval(function() {
            gameLoop.loop();
        }, 1000 / this.tps);
    }
    loop() {
        for (let funKey in this.functions)
            this.functions[funKey]();
    }
}
