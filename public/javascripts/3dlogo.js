

(function logo(){

  var scene, camera, renderer;

  var WIDTH  = 100;
  var HEIGHT = 100;

  var SPEED = 0.01;
  var awGroup;
  var mesh;
  var clock;
  var over = false;

  var normalmat = new THREE.MeshNormalMaterial();
  var greenMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color( 0x22fB24 ),
    transparent: true,
    opacity: 0.5,
    //wireframe: true
  });

  init();
  render();

function init() {
    scene = new THREE.Scene();
    scene3d = document.getElementById("3dlogo");

    clock = new THREE.Clock;
    clock.autoStart = false;

    initMesh();
    initCamera();
    initLights();
    initRenderer();

    scene3d.appendChild(renderer.domElement);
}

document.getElementById('3dlogo').onclick = function () {
    path = "/"
    window.location.href = path;
}

document.getElementById('3dlogo').onmouseover = function () {
    //mesh.children[0].material = greenMaterial;
    //console.log("OVERWEE" + mesh);
    clock.start();
    over = true;
    $('html,header').css('cursor', 'pointer');
}

document.getElementById('3dlogo').onmouseout = function () {
    mesh.children[0].material = normalmat;
    //console.log("OUTWEE" + mesh);
    clock.stop();
    over = false;
    $('html,header').css('cursor', 'default');
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


function initMesh() {
    var loader = new THREE.OBJLoader();
    loader.load('../../models/AW.obj', function(geometry, materials) {
        awGroup = new THREE.Object3D();
        //material = new THREE.MeshNormalMaterial();
        //geometry.children[0].material.wireframe = true;
        geometry.children[0].material = normalmat;


        mesh = geometry;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 20;
        mesh.translation = geometry.center;
        mesh.material = normalmat;
        awGroup.add(mesh);
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

function blinkMaterial() {
  mildelta = clock.getElapsedTime() % 1;
  //console.log("MILI = " + mildelta);
  tenths =  Math.floor(mildelta / .1);
  //console.log("TENTHS = " + Math.floor(tenths));
  if(tenths % 2 == 0){
    mesh.children[0].material = greenMaterial;
  } else {
    mesh.children[0].material = normalmat;
  }
}

function render() {
    requestAnimationFrame(render);
    rotateMesh();
    renderer.render(scene, camera);
    //console.log(clock.elapsedTime);
    if(over == true) {
      blinkMaterial();
    }
}
})();
