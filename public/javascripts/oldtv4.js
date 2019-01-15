//Bad TV Shader Demo
//Using Three.js r.75
//by Felix Turner / www.airtight.cc / @felixturner

var camera, scene, renderer;
var video, videoTexture, videoMaterial, videoMaterialPost;
var composer;
var shaderTime = 0;
var badTVParams, badTVPass;
var staticParams, staticPass;
var rgbParams, rgbPass;
var filmParams, filmPass;
var renderPass, copyPass, renderPassBuffer;
var gui;
var pnoise, globalParams;
var mesh, cube;
var SPEED = 0.01;

var WIDTH  = 1000;
var HEIGHT = 1000;

var scene1, scene2;
var clearMaskPass;
var maskPass1, maskPass2;

var zdis = -8;
var ydis = -1;
var tvscale = 1;

var bufferTexture, ctx, texture, bufferScene, bufferRenderer, bufferCamera;

(function(){

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene1 = new THREE.Scene();

  initVideoPreBuffer();

  canvas = document.createElement("canvas");
	canvas.width = 512;
  canvas.height = 512;
  ctx = canvas.getContext("2d");
  texture = new THREE.CanvasTexture(canvas);

  bufferRenderer = new THREE.WebGLRenderer();
  bufferRenderer.setSize( 800, 600 );
  bufferCamera = new THREE.PerspectiveCamera(55, 1080/ 720, 20, 3000);
  bufferCamera.position.z = 1000;
  // Create a different scene to hold our buffer objects
  bufferScene = new THREE.Scene();
  //bufferScene.add(bufferCamera);
  // Create the texture that will store our result
  bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
  bufferTexture.texture = texture;
  //bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight);

  function animate() {

      ctx.save()
      ctx.scale(1, dimensions.width / dimensions.height)
      ctx.fillStyle = "#FF0000"
      ctx.fillRect((canvas.width / 2) - 25, (canvas.height / 2) -25, 50, 50);
  
      shaderTime += 0.1;
      badTVPass.uniforms[ 'time' ].value =  shaderTime;
      filmPass.uniforms[ 'time' ].value =  shaderTime;
      staticPass.uniforms[ 'time' ].value =  shaderTime;


      ctx.restore()
      texture.needsUpdate = true;
      effectComposer.render()
      renderer.render(mainScene, mainCamera)
      requestAnimationFrame(animate);
      effectComposer.swapBuffers()
  }
  plane.z = 0;
  plane.scale.x = plane.scale.y = 1.45;


  oldTV = document.getElementById("OldTV");
  console.log(oldTV);

  camnum = 10;
  camera1 = new THREE.OrthographicCamera( WIDTH / - camnum, WIDTH / camnum, HEIGHT / camnum, HEIGHT / - camnum, -100, 100);
  camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 1, 1000 );

  initVideoPostBuffer();
  initLights();
  console.log(videoMaterialPost);
  loadScreen1();
  initTVMesh();

  //add stats
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );

  //init renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( 800, 600 );
  renderer.autoClear = false;

  //controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.enableDamping = true;
  //controls.dampingFactor = 0.25;

  oldTV.appendChild( renderer.domElement );
  oldTV.appendChild( bufferRenderer.domElement );

  sphereGeometry = new THREE.SphereGeometry(100, 100, 100);
  sphere = new THREE.Mesh(sphereGeometry);


  cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
  cube = new THREE.Mesh(cubeGeometry, videoMaterialPost);
  cube.position.z = -5;
  cube.position.x = 1;
  cube.position.y = 1;

  camnum = 10;
  camera1 = new THREE.OrthographicCamera( WIDTH / - camnum,
     WIDTH / camnum, HEIGHT / camnum, HEIGHT / - camnum, -100, 100);

  scene1.add(cube);

  //POST PROCESSING
  //Create Shader Passes
  //clearPass = new THREE.ClearPass();
  clearMask = new THREE.ClearMaskPass();



  maskPass = new THREE.MaskPass(scene, camera);
  maskPass1 = new THREE.MaskPass(scene1, camera);
  //maskPass2 = new THREE.MaskPass(scene2, camera);
  maskPassInverse = new THREE.MaskPass(scene, camera);
  maskPassInverse1 = new THREE.MaskPass(scene1, camera);
  maskPassInverse.inverse = true;
  maskPassInverse1.inverse = true;

  renderPass = new THREE.RenderPass(scene, camera );
  renderPass1 = new THREE.RenderPass(scene1, camera );
  renderPassBuffer = new THREE.RenderPass( bufferScene, bufferCamera );

  //renderPass.clear = false;
  renderPass1.clear = false;

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
  bufferRenderer.domElement.addEventListener('click', randomizeParams, false);
  onResize();
  randomizeParams();
}

function loadScreen1() {

  var loader = new THREE.OBJLoader();
  loader.load('../models/tvscreen.obj', function(geometry) {
      normalmat = new THREE.MeshNormalMaterial();
      //geometry.children[0].material.wireframe = true;
      //geometry.children[0].material = normalmat;
      mesh = geometry;
      mesh.position.z = zdis;
      mesh.position.y = ydis;
      mesh.scale.x = mesh.scale.y = mesh.scale.z = tvscale;
      mesh.translation = geometry.center;
      //mesh.material = normalmat;
      //console.log(mesh.children);
      mesh.children[0].material = videoMaterialPost;
      //initVideo(mesh);
      scene1.add(mesh);
  });
}


function initScreenMesh() {
  planetMaterial1 = new THREE.MeshPhongMaterial({
    color: 0xF3FFE2,
    specular: 0xff0000,
    shininess:20
  });
  var loader = new THREE.OBJLoader();
  loader.load( '../models/tvscreen.obj', function ( object ) {

  // For any meshes in the model, add our material.
  object.traverse( function ( node ) {

    if ( node.isMesh ) node.material = planetMaterial1;

  } );

  // Add the model to the scene.
  scene1.add( object );
} );
}

function initTVMesh() {
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load('../models/tvbrownish.mtl', function (materials) {
      materials.preload();
      var loader = new THREE.OBJLoader();
      loader.setMaterials(materials)
      loader.load('../models/tvbrownish.obj', function(geometry, materials) {
          normalmat = new THREE.MeshNormalMaterial();
          //geometry.children[0].material.wireframe = true;
          //geometry.children[0].material = normalmat;
          mesh = geometry;
          mesh.position.z = zdis;
          mesh.position.y = ydis;
          mesh.scale.x = mesh.scale.y = mesh.scale.z = tvscale;
          mesh.translation = geometry.center;
          scene.add(mesh);
      });
  });
}

function initVideoPreBuffer() {

  video = document.getElementById( 'video' );
  video.loop = true;
  //video.src = '../videos';

  console.log("initVideo");


  videoTexture = new THREE.Texture( video );
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  videoMaterial = new THREE.MeshBasicMaterial( {
    map: videoTexture
  } );

}

function initVideoPostBuffer() {
  videoMaterialPost = new THREE.MeshBasicMaterial( {
    map: bufferTexture.texture
  } );

}

function initLights() {
  var light1 = new THREE.AmbientLight( 0x999999 ); // soft white light
  var light3 = new THREE.AmbientLight( 0x999999 );
  scene.add( light1 );
  scene1.add( light3 );

  var light = new THREE.PointLight( 0xffffff, 1, 100);
  light.position.set(-5, 20, 10 );
  scene.add( light );

  scene.add( light );
  scene1.add( light );

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

//renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);
  bufferComposer = new THREE.EffectComposer( bufferRenderer, bufferTexture);
  //bufferComposer = new THREE.EffectComposer( bufferRenderer);
  bufferComposer.addPass( renderPassBuffer );
  //Add Shader Passes to Composer
  //order is important
  composer = new THREE.EffectComposer( renderer, renderTarget);
  //composer.renderTarget1.stencilBuffer = true
  //composer.renderTarget2.stencilBuffer = true
  composer.addPass( renderPass );
  composer.addPass( renderPass1 );
  //composer.addPass( clearMask );
  //composer.addPass(renderPassBuffer);

  //composer.addPass( maskPassInverse1 );

  //now film effect only applied to cube
  //composer.addPass( maskPass1 );

  if (filmParams.show){
    //composer.addPass( filmPass );
    bufferComposer.addPass( filmPass );
  }

  if (badTVParams.show){
    //composer.addPass( badTVPass );
    bufferComposer.addPass( badTVPass );
  }

  if (rgbParams.show){
    //composer.addPass( rgbPass );
    bufferComposer.addPass( rgbPass );
  }

  if (staticParams.show){
    //composer.addPass( staticPass );
    bufferComposer.addPass( staticPass );
  }

  //composer.addPass( maskPass1 );
  //composer.addPass( clearMask );
  //composer.addPass( maskPass2 );
  //composer.addPass( clearMaskPass );




  composer.addPass( copyPass );
  bufferComposer.addPass( copyPass);
  //copyPass.renderToScreen = true;
  //copyPass.renderToScreen = false;
}

function animate() {
  cube.rotation.x -= SPEED * 2;
  //cube.rotation.y -= SPEED;
  //cube.rotation.z -= SPEED * 3;

  //mesh.rotation.y += 0.01;

  ctx.save();
  ctx.scale(1, WIDTH / HEIGHT);
  ctx.fillStyle = "#FF0000";
  ctx.fillRect((canvas.width / 2) - 25, (canvas.height / 2) -25, 50, 50);


  shaderTime += 0.1;
  badTVPass.uniforms[ 'time' ].value =  shaderTime;
  filmPass.uniforms[ 'time' ].value =  shaderTime;
  staticPass.uniforms[ 'time' ].value =  shaderTime;

  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
    if ( videoTexture ) videoTexture.needsUpdate = true;
  }

  //renderer.clear()
  requestAnimationFrame( animate );
  //renderer.autoClear = false;
  //renderer.clear();
  ctx.restore();
  texture.needsUpdate = true;

  //bufferComposer.render(0.1);
  //composer.render( 0.1);
  //renderer.render(scene1, camera);
  //bufferComposer.render(0.1, bufferTexture.texture);
  bufferComposer.render(0.1, bufferTexture);
  renderer.render(scene1, camera, composer.renderTarget2, true);
  renderer.render(bufferScene, bufferCamera, bufferTexture);
  //bufferComposer.render(0.1, bufferTexture);
  //requestAnimationFrame( animate );
  //bufferComposer.swapBuffers();

  //this works ** DONT CHANGE//
  //renderer.render(scene1, camera);
  //renderer.render(bufferScene, bufferCamera, bufferTexture);
  //bufferRenderer.render(bufferScene, bufferCamera);
  //this works ** DONT CHANGE//
  stats.update();
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  bufferRenderer.setSize(window.innerWidth, window.innerHeight);
  bufferCamera.aspect = window.innerWidth / window.innerHeight;
  bufferCamera.updateProjectionMatrix();
}
})();
