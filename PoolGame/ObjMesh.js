class ObjMesh {
    constructor(scene, objUrl, textureUrl, textureScale = 10, castShadow = false, receiveShadow = true, bump = true, bumpScale = 0.02, visible = true) {
        let textureLoader = new THREE.TextureLoader(),
            map = textureLoader.load(textureUrl),
            materialSettings = bump ? {
                map: map,
                bumpMap: map,
                bumpScale: bumpScale
            } : {
                map: map
            },
            material = new THREE.MeshPhongMaterial(materialSettings),
            objLoader = new THREE.OBJLoader();

        map.repeat.set(textureScale, textureScale);
        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        let that = this;
        objLoader.load(objUrl, function(object) {
            that.object = object;
            that.mesh = object.children[0];
            that.mesh.visible = visible;
            that.mesh.receiveShadow = receiveShadow;
            that.mesh.castShadow = castShadow;
            object.children[0].material = material;
            scene.add(object);
        });
    }
}
