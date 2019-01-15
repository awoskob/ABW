//Bad TV Shader Demo
//Using Three.js r.75
//by Felix Turner / www.airtight.cc / @felixturner

var camera, scene, renderer;
var video, videoTexture,videoMaterial;
var composer;
var shaderTime = 0;
var badTVParams, badTVPass;
var staticParams, staticPass;
var rgbParams, rgbPass;
var filmParams, filmPass;
var renderPass, copyPass;
var gui;
var pnoise, globalParams;
var mesh, cube;
var SPEED = 0.01;

var WIDTH  = 1000;
var HEIGHT = 1000;

var scene1, scene2;
var clearMaskPass;
var maskPass1, maskPass2;

(function(){

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene1 = new THREE.Scene();
  scene2 = new THREE.Scene();

  oldTV = document.getElementById("OldTV");
  console.log(oldTV);
  //camera = new THREE.PerspectiveCamera(55, 1080/ 720, 20, 3000);
  //camnum = 10;
  //camera = new THREE.OrthographicCamera( WIDTH / - camnum, WIDTH / camnum, HEIGHT / camnum, HEIGHT / - camnum, -100, 100);
  //camera.position.set(0, 0, 10);
  //camera.lookAt(scene.position);

  //camera.position.z = 1000;

  //camera = new THREE.OrthographicCamera( WIDTH / - camnum, WIDTH / camnum, HEIGHT / camnum, HEIGHT / - camnum, -100, 100);

  camera = new THREE.PerspectiveCamera(55, 1080/ 720, 20, 3000);
  camera.position.z = 1000;
  camera.lookAt(scene.position);
  //camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 1000);

  initLights();
  initVideo();
  initMesh();

  //add stats
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );

  //init renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( 800, 600 );
  oldTV.appendChild( renderer.domElement );

  sphereGeometry = new THREE.SphereGeometry(100, 100, 100);
  sphere = new THREE.Mesh(sphereGeometry);

  cubeGeometry = new THREE.CubeGeometry(100, 100, 100);
  cube = new THREE.Mesh(cubeGeometry);
  cube.position.z = 200;

  scene1.add(cube);

  //POST PROCESSING
  //Create Shader Passes
  //clearPass = new THREE.ClearPass();
  clearMask = new THREE.ClearMaskPass();
  maskPass1 = new THREE.MaskPass(scene1, camera);
  maskPass2 = new THREE.MaskPass(scene2, camera);

  renderPass = new THREE.RenderPass(scene, camera );
  badTVPass = new THREE.ShaderPass( THREE.BadTVShader );
  rgbPass = new THREE.ShaderPass( THREE.RGBShiftShader );
  filmPass = new THREE.ShaderPass( THREE.FilmShader );
  staticPass = new THREE.ShaderPass( THREE.StaticShader );
  copyPass = new THREE.ShaderPass( THREE.CopyShader );

  //set shader uniforms
  filmPass.uniforms.grayscale.value = 0;

  //Init DAT GUI control panel
  badTVParams = {
    mute:true,
    show: true,
    distortion: 3.0,
    distortion2: 1.0,
    speed: 0.3,
    rollSpeed: 0.1
  };

  staticParams = {
    show: true,
    amount:0.5,
    size:4.0
  };

  rgbParams = {
    show: true,
    amount: 0.005,
    angle: 0.0,
  };

  filmParams = {
    show: true,
    count: 800,
    sIntensity: 0.9,
    nIntensity: 0.4
  };

  gui = new dat.GUI();

  gui.add(badTVParams, 'mute').onChange(onToggleMute);

  var f1 = gui.addFolder('Bad TV');
  f1.add(badTVParams, 'show').onChange(onToggleShaders);
  f1.add(badTVParams, 'distortion', 0.1, 20).step(0.1).listen().name('Thick Distort').onChange(onParamsChange);
  f1.add(badTVParams, 'distortion2', 0.1, 20).step(0.1).listen().name('Fine Distort').onChange(onParamsChange);
  f1.add(badTVParams, 'speed', 0.0,1.0).step(0.01).listen().name('Distort Speed').onChange(onParamsChange);
  f1.add(badTVParams, 'rollSpeed', 0.0,1.0).step(0.01).listen().name('Roll Speed').onChange(onParamsChange);
  f1.open();

  var f2 = gui.addFolder('RGB Shift');
  f2.add(rgbParams, 'show').onChange(onToggleShaders);
  f2.add(rgbParams, 'amount', 0.0, 0.1).listen().onChange(onParamsChange);
  f2.add(rgbParams, 'angle', 0.0, 2.0).listen().onChange(onParamsChange);
  f2.open();

  var f4 = gui.addFolder('Static');
  f4.add(staticParams, 'show').onChange(onToggleShaders);
  f4.add(staticParams, 'amount', 0.0,1.0).step(0.01).listen().onChange(onParamsChange);
  f4.add(staticParams, 'size', 1.0,100.0).step(1.0).onChange(onParamsChange);
  f4.open();

  var f3 = gui.addFolder('Scanlines');
  f3.add(filmParams, 'show').onChange(onToggleShaders);
  f3.add(filmParams, 'count', 50, 1000).onChange(onParamsChange);
  f3.add(filmParams, 'sIntensity', 0.0, 2.0).step(0.1).onChange(onParamsChange);
  f3.add(filmParams, 'nIntensity', 0.0, 2.0).step(0.1).onChange(onParamsChange);
  f3.open();

  gui.close();

  onToggleShaders();
  onToggleMute();
  onParamsChange();

  window.addEventListener('resize', onResize, false);
  renderer.domElement.addEventListener('click', randomizeParams, false);
  onResize();
  randomizeParams();
}

function initMesh() {
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load('../models/OldTV3.mtl', function (materials) {
      materials.preload();
      var loader = new THREE.OBJLoader();
      loader.setMaterials(materials)
      loader.load('../models/OldTV3.obj', function(geometry, materials) {
          normalmat = new THREE.MeshNormalMaterial();
          //geometry.children[0].material.wireframe = true;
          //geometry.children[0].material = normalmat;
          mesh = geometry;
          mesh.position.set = (0,0,10);
          mesh.scale.x = mesh.scale.y = mesh.scale.z = 100;
          mesh.translation = geometry.center;
          //mesh.material = normalmat;
          //console.log(mesh.children);
          mesh.children[1].material = videoMaterial;
          //initVideo(mesh);
          scene.add(mesh);
      });
  });
}

function initVideo() {

  video = document.getElementById( 'video' );
  video.loop = true;
  //video.src = '../videos';

  console.log("initVideo");
  //video = document.getElementById( 'video' );

  //video = document.createElement( 'video' );
  //video.loop = true;
  //video.src = '../bad-tv-shader-master/example/res/fits.mp4';
  //video.play();

  //console.log(video);
  //playPromise = video.play();

  //if (playPromise !== undefined) {
      //playPromise.then(_ => {
        // Automatic playback started!
        // Show playing UI.
        //url.muted = false;
    //  })
    //  .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
  //  });
//  }


  videoTexture = new THREE.Texture( video );
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  videoMaterial = new THREE.MeshBasicMaterial( {
    map: videoTexture
  } );

  //mesh.children[1].material = videoMaterial;
  //console.log(mesh.children);
}

function initLights() {
  var light1 = new THREE.AmbientLight( 0x999999 ); // soft white light
  var light3 = new THREE.AmbientLight( 0x999999 );
  scene.add( light1 );
  scene1.add( light3 );

    var light2 = new THREE.SpotLight( 0xffffff, 5, 1000 );
				light2.position.set( - 100, 350, 350 );
				light2.angle = 0.5;
				light2.penumbra = 0.5;
				light2.castShadow = true;
				light2.shadow.mapSize.width = 1024;
				light2.shadow.mapSize.height = 1024;

    scene.add( light2 );
    scene1.add( light2 );
    scene2.add( light2 );
}

function onParamsChange() {

  //copy gui params into shader uniforms
  badTVPass.uniforms[ 'distortion' ].value = badTVParams.distortion;
  badTVPass.uniforms[ 'distortion2' ].value = badTVParams.distortion2;
  badTVPass.uniforms[ 'speed' ].value = badTVParams.speed;
  badTVPass.uniforms[ 'rollSpeed' ].value = badTVParams.rollSpeed;

  staticPass.uniforms[ 'amount' ].value = staticParams.amount;
  staticPass.uniforms[ 'size' ].value = staticParams.size;

  rgbPass.uniforms[ 'angle' ].value = rgbParams.angle*Math.PI;
  rgbPass.uniforms[ 'amount' ].value = rgbParams.amount;

  filmPass.uniforms[ 'sCount' ].value = filmParams.count;
  filmPass.uniforms[ 'sIntensity' ].value = filmParams.sIntensity;
  filmPass.uniforms[ 'nIntensity' ].value = filmParams.nIntensity;
}


function randomizeParams() {

  if (Math.random() <0.2){
    //you fixed it!
    badTVParams.distortion = 0.1;
    badTVParams.distortion2 =0.1;
    badTVParams.speed =0;
    badTVParams.rollSpeed =0;
    rgbParams.angle = 0;
    rgbParams.amount = 0;
    staticParams.amount = 0;

  }else{
    badTVParams.distortion = Math.random()*10+0.1;
    badTVParams.distortion2 =Math.random()*10+0.1;
    badTVParams.speed =Math.random()*0.4;
    badTVParams.rollSpeed =Math.random()*0.2;
    rgbParams.angle = Math.random()*2;
    rgbParams.amount = Math.random()*0.03;
    staticParams.amount = Math.random()*0.2;
  }

  onParamsChange();
}

function onToggleMute(){
  video.volume  = badTVParams.mute ? 0 : 1;
}

function onToggleShaders(){

  //Add Shader Passes to Composer
  //order is important
  composer = new THREE.EffectComposer( renderer);
  composer.addPass( renderPass );
  //composer.addPass( clearMask );

  //composer.addPass( maskPass1 );

  if (filmParams.show){
    composer.addPass( filmPass );
  }

  if (badTVParams.show){
    composer.addPass( badTVPass );
  }

  if (rgbParams.show){
    composer.addPass( rgbPass );
  }

  if (staticParams.show){
    composer.addPass( staticPass );
  }

  //composer.addPass( maskPass1 );
  //composer.addPass( clearMask );
  //composer.addPass( maskPass2 );
  //composer.addPass( clearMaskPass );


  composer.addPass( copyPass );
  copyPass.renderToScreen = true;
  //copyPass.renderToScreen = false;
}

function animate() {
  cube.rotation.x -= SPEED * 2;
  cube.rotation.y -= SPEED;
  cube.rotation.z -= SPEED * 3;

  shaderTime += 0.1;
  badTVPass.uniforms[ 'time' ].value =  shaderTime;
  filmPass.uniforms[ 'time' ].value =  shaderTime;
  staticPass.uniforms[ 'time' ].value =  shaderTime;

  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
    if ( videoTexture ) videoTexture.needsUpdate = true;
  }

  requestAnimationFrame( animate );
  composer.render( 0.1);
  stats.update();
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
})();
