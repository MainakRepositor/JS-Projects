//deels credit aan hindrik
class SkyBox extends THREE.Mesh {
    constructor(scene, directory) {
        let urls = [directory + 'posx.jpg', directory + 'negx.jpg', directory + 'posy.jpg', directory + 'negy.jpg', directory + 'posz.jpg', directory + 'negz.jpg'],
            skyGeometry = new THREE.CubeGeometry(10000, 10000, 10000),
            materialArray = [],
            textureLoader = new THREE.TextureLoader();

        for (let url of urls) {
            materialArray.push(new THREE.MeshBasicMaterial({
                map: textureLoader.load(url),
                side: THREE.BackSide
            }));
        }

        let skyMaterial = new THREE.MeshFaceMaterial(materialArray);

        super(skyGeometry, skyMaterial);
        scene.add(this);

        let skyBox = this;
        this.loop = scene.main.loop.add(function() {
            skyBox.position.set(scene.camera.position.x, scene.camera.position.y, scene.camera.position.z);
        });
    }
}
