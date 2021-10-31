class Sound {
    constructor(src) {
        this.context = new AudioContext();
        this.analyser = this.context.createAnalyser();
        this.analyser.connect(this.context.destination);

        let sound = this;
        this.loadSound(src).then(function(buffer) {
            sound.buffer = buffer;
        });
    }
    loadSound(audioURL) {
        let sound = this;
        return new Promise(function(resolve) {
            fetch(audioURL).then(o => o.arrayBuffer().then(function(arrayBuffer) {
                sound.context.decodeAudioData(arrayBuffer, function(buffer) {
                    resolve(buffer);
                });
            }));
        })
    }
    setSource() {
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;

        this.source.connect(this.analyser);
    }
    play(v) {
        this.setSource(v);
        this.source.start(0);
        let sound = this;
        this.source.onended = function() { sound.stop() };
    }
    stop() {
        this.source.stop()
    }
}
class FrequencySound extends Sound {
    constructor(src) { super(src); }

    setSource(v = 1) {
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.filter = this.context.createBiquadFilter();
        this.filter.type = (typeof this.filter.type === 'string') ? 'lowpass' : 0;
        this.filter.frequency.value = 5000;
        this.source.connect(this.filter);
        this.filter.connect(this.context.destination);

        this.frequency = v;
    }

    set frequency(f) {
        f = f > 1 ? 1 : f;
        f = f < 0 ? 0 : f;

        let minValue = 40;
        let maxValue = this.context.sampleRate / 2;
        let numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
        let multiplier = Math.pow(2, numberOfOctaves * (f - 1.0));
        this.filter.frequency.value = maxValue * multiplier;

        this._frequency = f;
    }
    get frequency() {
        return this._frequency;
    }
}
class VolumeSound extends Sound {
    constructor(src) { super(src); }

    setSource(v) {
        if (!this.context.createGain)
            this.context.createGain = this.context.createGainNode;
        this.gainNode = this.context.createGain();

        super.setSource();
        this.source.connect(this.gainNode);

        this.gainNode.connect(this.context.destination);

        this.volume = v;
    }

    set volume(v = 1) {
        this._volume = v > 1 ? 1 : v;
        this._volume = this._volume < 0 ? 0 : this._volume;
        v = this.volume;
        v *= 3;
        v -= 1;
        this.gainNode.gain.value = v;
    }
    get volume() {
        return this._volume;
    }
}
