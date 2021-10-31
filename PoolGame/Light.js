class SpotLight extends THREE.SpotLight {
    constructor(scene, x, y, z, target, shadow = true, color = 0xffffff, intensity = 1) {
        super(color);
        this.intensity = intensity;
        this.distance = 200;
        this.angle = 0.5;
        this.penumbra = 0.2;
        this.decay = 1;

        if (shadow) {
            this.castShadow = true;
            this.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(80, 1, 1, 2500));
            this.shadow.bias = 0.0005;
            this.shadow.mapSize.height = 1024;
            this.shadow.mapSize.width = 1024;
        }

        this.target = target;
        this.position.set(x, y, z);

        scene.add(this);
    }
}
class DirectionalLight extends THREE.DirectionalLight {
    constructor(scene, x, y, z, target, shadow = true, color = 0xffffff, intensity = 1) {
        super(color);
        this.intensity = intensity;

        if (shadow) {
            this.castShadow = true;
            this.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(80, 1, 1, 2500));
            this.shadow.bias = 0.0005;
            this.shadow.mapSize.height = 1024;
            this.shadow.mapSize.width = 1024;
        }

        this.position.set(x, y, z);
        if (target)
            this.lookAt = target.position;

        scene.add(this);
    }
}
class AmbientLight extends THREE.AmbientLight {
    constructor(scene, color = 0xffffff, intensity = 1) {
        super(color, intensity);
        scene.add(this);
    }
}
