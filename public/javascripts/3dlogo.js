

(function logo(){

  var scene, camera, renderer;

  var WIDTH  = 100;
  var HEIGHT = 100;

  var SPEED = 0.01;

  var normalmat = new THREE.MeshNormalMaterial();

  init();
  render();

function init() {
    scene = new THREE.Scene();
    scene3d = document.getElementById("3dlogo");

    initMesh();
    initCamera();
    initLights();
    initRenderer();

    scene3d.appendChild(renderer.domElement);
}

function initCamera() {
    camnum = 10;
    camera = new THREE.OrthographicCamera( WIDTH / - camnum, WIDTH / camnum, HEIGHT / camnum, HEIGHT / - camnum, -10, 20);;
    camera.position.set(0, 0, 5);
    camera.lookAt(scene.position);
}


function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});
    renderer.setSize(WIDTH, HEIGHT);
}

function initLights() {
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
}

var mesh = null;
function initMesh() {
    var loader = new THREE.OBJLoader();
    loader.load('../models/AW.obj', function(geometry, materials) {
        //material = new THREE.MeshNormalMaterial();
        //geometry.children[0].material.wireframe = true;
        geometry.children[0].material = normalmat;


        mesh = geometry;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 20;
        mesh.translation = geometry.center;
        mesh.material = normalmat;
        scene.add(mesh);
    });
}

function rotateMesh() {
    if (!mesh) {
        return;
    }

    mesh.rotation.y -= .01;
    //mesh.rotation.x -= SPEED * 2;
    //mesh.rotation.y -= SPEED;
    //mesh.rotation.z -= SPEED * 3;
}

function render() {
    requestAnimationFrame(render);
    rotateMesh();
    renderer.render(scene, camera);
}
})();
