class KeyHandler {
    constructor(gameLoop) {
        this.keyPressed = [];

        let handler = this;
        document.addEventListener('keydown', function(e) {
            handler.keydown(e, handler);
        }, false);
        document.addEventListener('keyup', function(e) {
            handler.keyup(e, handler);
        }, false);

        this.checkLoop = gameLoop.add(function() {
            for (let checkKey in handler.continuousKeyFunctions)
                handler.isPressed(checkKey) && handler.continuousKeyFunctions[checkKey].action(handler.keyPressed[handler.keyPressed.map(k => k.key).indexOf(checkKey)].event);
        });

        this.singleKeyFunctions = {};
        this.continuousKeyFunctions = {};
    }

    get keyMap() {
        let map = {};
        map.continuous = {};
        for (let key in this.continuousKeyFunctions)
            map.continuous[key] = this.continuousKeyFunctions[key];
        map.single = {};
        for (let key in this.singleKeyFunctions)
            map.single[key] = this.singleKeyFunctions[key];
        return map;
    }

    setSingleKey(key, name, fun) {
        this.singleKeyFunctions[key] = {
            action: fun,
            name: name
        };
    }
    deleteSingleKey(key) {
        delete this.singleKeyFunctions[key];
    }
    setContinuousKey(key, name, fun) {
        this.continuousKeyFunctions[key] = {
            action: fun,
            name: name
        };
    }
    deleteContinuousKey(key) {
        delete this.continuousKeyFunctions[key];
    }

    keydown(e, handler) {
        let key = e.key;
        if (!handler.isPressed(key)) {
            handler.keyPressed.push({
                key: key,
                event: e
            });
        }
        for (let checkKey in handler.singleKeyFunctions)
            if (key === checkKey)
                handler.singleKeyFunctions[checkKey].action(e);
    }

    keyup(e, handler) {
        let key = e.key;
        handler.keyPressed.splice(handler.keyPressed.map(k => k.key).indexOf(key), 1);
    }

    isPressed(key) {
        return this.keyPressed.map(k => k.key).includes(key);
    }
}
