class MeshAnimationMaterial extends THREE.MeshStandardMaterial {
    constructor(config) {
        let directory = config.directory;
        if (directory[directory.length - 1] !== '/')
            directory += '/';
        delete config.directory;

        super(config);
        this.config = config;

        this.directory = directory;
        this.files = {};
        this.textureLoader = new THREE.TextureLoader();

        let material = this;
        fetch(directory).then(data =>
            data.text().then(function(txt) {
                let lines = txt.split('"frame_');
                lines.splice(0, 1);
                for (let i = 0; i < lines.length; i++) {
                    let fileName = 'frame_' + lines[i].split('s.png"')[0] + 's.png',
                        frameNumber = parseInt(fileName.split('frame_')[1].split('_delay')[0]),
                        frameDelay = Number(fileName.split('delay-')[1].split('s.png')[0]);
                    material.files[frameNumber] = {
                        name: fileName
                    };
                    material.frameDelay = frameDelay;
                }

                if (material.files[0])
                    material.loadImages();
            }));
    }
    loadImages() {
        this.currentIndex = 0;
        this.length = 0;
        this.iterations = 1;

        for (let frame in this.files) {
            this.files[frame].map = this.textureLoader.load(this.directory + this.files[frame].name);
            this.files[frame].map.repeat.set(2, 1);
            this.files[frame].map.wrapS = this.files[frame].map.wrapT = THREE.RepeatWrapping;
            let frameNum = parseInt(frame);
            if (frameNum > this.length)
                this.length = frameNum;
        }

        this.map = this.files[0].map;
        this.needsUpdate = true;
    }
    play() {
        if (this.length) {
            if (this.animationLoop)
                this.pause();

            let material = this;
            this.animationLoop = self.setInterval(function() {
                material.files[++material.currentIndex].map.repeat.set(2 * material.iterations, 1 * material.iterations);
                material.map = material.files[material.currentIndex].map;
                material.needsUpdate = true;

                if (material.currentIndex >= material.length) {
                    material.iterations++;
                    material.currentIndex = 0;
                }
            }, this.frameDelay * 1000);
        }
    }
    pause() {
        if (this.animationLoop){
            clearInterval(this.animationLoop);
            delete this.animationLoop;
        }
    }
    toggle() {
        if (this.animationLoop)
            this.pause();
        else
            this.play();
    }
}
