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
var cube, torus;
var SPEED = 0.01;

var WIDTH  = 1000;
var HEIGHT = 1000;

var scene1, scene2;
var clearMaskPass;
var maskPass, maskPass1, maskPass2;

var renderPassEarth;
var renderPassMars;

var earthMask;
// mars mask
var marsMask;

var mars, earth;

var webGLRenderer;
var effectCopySpace;

var clock;

var tvmesh;


(function(){

init();
//render();
animate();

function init() {
  clock = new THREE.Clock()
  scene = new THREE.Scene();
  sceneChild = new THREE.Scene();
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

  camera1 = new THREE.PerspectiveCamera(55, 1080/ 720, 20, 3000);
  camera1.position.z = 1000;
  camera1.lookAt(scene.position);

  camera2 = new THREE.PerspectiveCamera(55, 1080/ 720, 20, 3000);
  camera2.position.z = 1000;
  camera2.lookAt(scene.position);
  //camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 1000);


  initLights();
  initVideo();
  initMesh();

  tvmesh = scene.children[0];
  console.log(tvmesh.children[1]);


  //add stats
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );

  //init renderer
  renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
  renderer.setSize( 800, 600 );
  renderer.setClearColor(new THREE.Color(0x000));
  renderer.shadowMap.enabled = true

  //SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT

  webGLRenderer = new THREE.WebGLRenderer()
  webGLRenderer.setClearColor(new THREE.Color(0x000))
  webGLRenderer.setSize(window.innerWidth, window.innerHeight)
  webGLRenderer.shadowMap.enabled = true
    //webGLRenderer.autoClear = false;

  var sceneEarth = new THREE.Scene()
  var sceneMars = new THREE.Scene()
  var sceneBG = new THREE.Scene()
  earth = createEarthMesh(new THREE.TorusGeometry(10, 5, 5))
  earth.position.x = -10

  mars = createMarsMesh(new THREE.CubeGeometry(5, 5, 5))
  mars.position.x = 10
  sceneEarth.add(earth)
  sceneMars.add(mars)

  var cameraSpace = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000
  )

  var cameraBG = new THREE.OrthographicCamera(
    -window.innerWidth, window.innerWidth,
    window.innerHeight, -window.innerHeight,
    -10000, 10000,
  )
  cameraBG.position.z = 50

  var sphere = createEarthMesh(new THREE.TorusGeometry(10, 5, 5))
  sphere.position.x = -10

  var sphere2 = createMarsMesh(new THREE.CubeGeometry(5, 5, 5))
  sphere2.position.x = 10
  sceneEarth.add(sphere)
  sceneMars.add(sphere2)

  cameraSpace.position.x = -10
  cameraSpace.position.y = 15
  cameraSpace.position.z = 25
  cameraSpace.lookAt(new THREE.Vector3(0, 0, 0))

  var ambi = new THREE.AmbientLight(0x181818)
  var ambi2 = new THREE.AmbientLight(0x181818)
  sceneEarth.add(ambi)
  sceneMars.add(ambi2)

  var spotLight = new THREE.DirectionalLight(0xffffff)
  spotLight.position.set(550, 100, 550)
  spotLight.intensity = 0.6

  var spotLight2 = new THREE.DirectionalLight(0xffffff)
  spotLight2.position.set(550, 100, 550)
  spotLight2.intensity = 0.6

  sceneEarth.add(spotLight)
  sceneMars.add(spotLight2)

  renderPassEarth = new THREE.RenderPass(sceneEarth, cameraSpace)
  renderPassEarth.clear = false
  renderPassMars = new THREE.RenderPass(sceneMars, cameraSpace)
  renderPassMars.clear = false

  earthMask = new THREE.MaskPass(sceneEarth, cameraSpace)
  // mars mask
  marsMask = new THREE.MaskPass(sceneMars, cameraSpace)

  effectCopySpace = new THREE.ShaderPass(THREE.CopyShader)
  effectCopySpace.renderToScreen = true

 // SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT SPACE SHIT

  oldTV.appendChild( renderer.domElement );

  planetMaterial1 = new THREE.MeshPhongMaterial();
  planetMaterial1.specular = new THREE.Color(0x123456);
  planetMaterial2 = new THREE.MeshPhongMaterial();
  planetMaterial2.specular = new THREE.Color(0x654321);

  torusGeometry = new THREE.TorusGeometry(100, 100, 100);
  torus = new THREE.SceneUtils.createMultiMaterialObject(torusGeometry, [planetMaterial2]);
  torus.position.z = 200;
  torus.position.x = -100;

  scene1.add(torus);

  cubeGeometry = new THREE.CubeGeometry(40, 40, 40);
  cube = new THREE.SceneUtils.createMultiMaterialObject(cubeGeometry, [planetMaterial1]);
  cube.position.z = 800;
  cube.position.x = 50;
  scene2.add(cube);



  //POST PROCESSING
  //Create Shader Passes

  //clearPass = new THREE.ClearPass();
  clearMask = new THREE.ClearMaskPass();
  maskPass = new THREE.MaskPass(scene, camera);
  maskPassChild = new THREE.MaskPass(sceneChild, camera);
  maskPass1 = new THREE.MaskPass(scene1, camera);
  maskPass2 = new THREE.MaskPass(scene2, camera);

  maskPassInverse = new THREE.MaskPass(scene, camera);
  maskPassChildInverse = new THREE.MaskPass(sceneChild, camera);
  maskPassInverse1 = new THREE.MaskPass(scene1, camera);
  maskPassInverse2 = new THREE.MaskPass(scene2, camera);
  maskPassInverse.inverse = true;
  maskPassInverse1.inverse = true;
  maskPassInverse2.inverse = true;

  renderPass1 = new THREE.RenderPass(scene1, camera );
  renderPass2 = new THREE.RenderPass(scene2, camera );

  renderPass = new THREE.RenderPass(scene, camera );
  renderPassChild = new THREE.RenderPass(sceneChild, camera );

  renderPass.clear = false;
  renderPassChild.clear = false;
  renderPass1.clear = false;
  renderPass2.clear = false;



  badTVPass = new THREE.ShaderPass( THREE.BadTVShader );
  rgbPass = new THREE.ShaderPass( THREE.RGBShiftShader );
  filmPass = new THREE.ShaderPass( THREE.FilmShader );
  staticPass = new THREE.ShaderPass( THREE.StaticShader );
  copyPass = new THREE.ShaderPass( THREE.CopyShader );

  //badTVPass.clear = false;
  //rgbPass.clear = false;
  //filmPass.clear = false;
  //staticPass.clear = false;
  //copyPass.clear = false;



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

function createMarsMesh(geom) {
  //var textureLoader = new THREE.TextureLoader()
  //var planetTexture = textureLoader.load(mycdn + '/assets/textures/planets/Mars_2k-050104.png')
  //var normalTexture = textureLoader.load(mycdn + '/assets/textures/planets/Mars-normalmap_2k.png')
  var planetMaterial = new THREE.MeshPhongMaterial();
  planetMaterial.specular = new THREE.Color(0xffffff);
  //planetMaterial.normalMap = normalTexture
  //planetMaterial.map = planetTexture

  var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

  return mesh;
}

function createEarthMesh(geom) {
  //var textureLoader = new THREE.TextureLoader()
  //var planetTexture = textureLoader.load(mycdn + '/assets/textures/planets/Earth.png')
//  var specularTexture = textureLoader.load(mycdn + '/assets/textures/planets/EarthSpec.png')
  //var normalTexture = textureLoader.load(mycdn + '/assets/textures/planets/EarthNormal.png')

  var planetMaterial = new THREE.MeshPhongMaterial();
  //planetMaterial.specularMap = specularTexture
  planetMaterial.specular = new THREE.Color(0xffffff);
  //planetMaterial.normalMap = normalTexture
  //planetMaterial.map = planetTexture

  var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);
  return mesh;
}

function initMesh() {
  //var tvmesh;
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load('../models/OldTV3.mtl', function (materials) {
      materials.preload();
      var loader = new THREE.OBJLoader();
      loader.setMaterials(materials)
      loader.load('../models/OldTV3.obj', function(geometry, materials) {
          normalmat = new THREE.MeshNormalMaterial();
          //geometry.children[0].material.wireframe = true;
          //geometry.children[0].material = normalmat;
          tvmesh = geometry;
          tvmesh.position.z = 500;
          tvmesh.position.y = -100;
          tvmesh.scale.x = tvmesh.scale.y = tvmesh.scale.z = 100;
          tvmesh.translation = geometry.center;
          //mesh.material = normalmat;
          //console.log(mesh.children);
          tvmesh.children[1].material = videoMaterial;
          console.log(tvmesh);
          //initVideo(mesh);
          tvmesh.name = "TV";
          scene.add(tvmesh);
          //sceneChild.add(tvmesh.children[1]);
      });
  });
  //console.log(tvmesh);
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
  var light1 = new THREE.AmbientLight( 0xffffff ); // soft white light
  var light3 = new THREE.AmbientLight( 0x999999 );
  var light4 = new THREE.AmbientLight( 0x999999 );
  scene.add( light1 );
  scene1.add( light3 );
  scene2.add( light4 );

    var light2 = new THREE.SpotLight( 0xffffff);
				light2.position.set( - 100, 150, 550 );
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
  const renderTargetParameters = {
			        minFilter:      THREE.LinearFilter,
			        magFilter:      THREE.LinearFilter,
			        format:         THREE.RGBAFormat,
			        stencilBuffer:  true
			    };

  renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);

  //Add Shader Passes to Composer
  //order is important
  //composer = new THREE.EffectComposer( renderer);
  composer = new THREE.EffectComposer( renderer, renderTarget);

  //composer = new THREE.EffectComposer(webGLRenderer, renderTarget)
  composer.renderTarget1.stencilBuffer = true;
  composer.renderTarget2.stencilBuffer = true;

  //composer.addPass(renderPassEarth)
  //composer.addPass(renderPassMars)
  //composer.addPass(marsMask)

  composer.addPass( renderPass);
  //composer.addPass( renderPass2);
  //composer.addPass( renderPassChild);
  //composer.addPass( clearMask );
  //composer.addPass( maskPassInverse2 );
  //composer.addPass( maskPassInverse );
  //composer.addPass( clearMask );
  //composer.addPass( maskPass2 );
  //composer.addPass( maskPassChild );
  //composer.addPass( maskPass);

  if (filmParams.show){
    //composer.addPass( filmPass );
  }

  if (badTVParams.show){
    //composer.addPass( badTVPass );
  }

  if (rgbParams.show){
    //composer.addPass( rgbPass );
  }

  if (staticParams.show){
    //composer.addPass( staticPass );
  }
  //composer.addPass( renderPass);
  //composer.addPass( clearMask );
  //composer.addPass( renderPass2);
  //composer.addPass( renderPass1);
  //composer.addPass( maskPass1 );
  //composer.addPass( clearMask );
  //composer.addPass( renderPass2);

  //composer.addPass( maskPass1 );
  //composer.addPass( renderPass1 );
  //composer.addPass( clearMask );
  composer.addPass( copyPass );

  //composer.addPass( effectCopySpace );
  copyPass.renderToScreen = true;
  //copyPass.renderToScreen = false;
}

function render() {
  //stats.update()
  //webGLRenderer.clear();
  webGLRenderer.autoClear = false;

  shaderTime += 0.1;
  //badTVPass.uniforms[ 'time' ].value =  shaderTime;
  //filmPass.uniforms[ 'time' ].value =  shaderTime;
  //staticPass.uniforms[ 'time' ].value =  shaderTime;

  var delta = clock.getDelta()
  //orbitControls.update(delta)

  mars.rotation.y += 0.02
  earth.rotation.y += 0.02

  requestAnimationFrame(render)
  composer.render(delta)
}

function animate() {
  //renderPass.clear = true;
  //renderPass2.clear = true;
  renderer.autoClear = false;

  mars.rotation.y += 0.002

  torus.rotation.x -= SPEED * 2;
  torus.rotation.y -= SPEED;
  torus.rotation.z -= SPEED * 3;

  //cube.rotation.x -= SPEED * 2;
  //cube.rotation.y -= SPEED;
  //cube.rotation.z -= SPEED * 3;

  var delta = clock.getDelta()

  //mesh.rotation.x -= SPEED;

  shaderTime += 0.1;
  badTVPass.uniforms[ 'time' ].value =  shaderTime;
  filmPass.uniforms[ 'time' ].value =  shaderTime;
  staticPass.uniforms[ 'time' ].value =  shaderTime;

  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
    if ( videoTexture ) videoTexture.needsUpdate = true;
  }
  //renderer.autoClear = false;
  //renderPass.clear = false;
  //renderPass2.clear = false;
  renderer.clear();
  //renderer.clearDepth();
  composer.render(delta);
  stats.update();
  requestAnimationFrame( animate );
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
})();
