let scene, camera, renderer, starGeometry, stars;
//absolute path to the images folder needed to load the textures
const imagePath = window.location.protocol + "//" + window.location.host + "/";

function init() {
  //initialise the scene
  scene = new THREE.Scene();
  //use a perspective camera and set aspect ratio to match the aspect ratio of the viewport
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  //initialise renderer and set background to transparent
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setClearColor(0x000000, 0);
  //set the size of the renderer to the size of the viewport
  renderer.setSize(window.innerWidth, window.innerHeight);
  //add renderer to the document body
  document.body.appendChild(renderer.domElement);

  //create a star geometry using sprites
  starGeometry = new THREE.Geometry();
  for (i = 0; i < 6000; i++) {
    star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    star.velocity = 0;
    star.acceleration = 0.02;
    starGeometry.vertices.push(star);
  }
  let sprite = new THREE.TextureLoader().load(`${imagePath}img/star.png`);
  let starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 1,
    map: sprite
  });

  stars = new THREE.Points(starGeometry, starMaterial);

  //add stars to the scene
  scene.add(stars);
  //listen for window resize to update aspect ratio
  window.addEventListener("resize", onWindowResize, false);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  //loop through the stars and update the velocity and the position
  starGeometry.vertices.forEach(star => {
    star.velocity += star.acceleration;
    star.y -= star.velocity;
    //if star falls behind the screen reset position and velocity
    if (star.y < -200) {
      star.velocity = 0;
      star.y = 200;
    }
  });
  //inform ThreeJS to monitor the state of our stars and update them if need be
  starGeometry.verticesNeedUpdate = true;
  //add rotation to the stars
  stars.rotation.y += 0.002;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
