(function buffercompparticle(){

  var effectComposer;

  var composer;
  var shaderTime = 0;
  var badTVParams, badTVPass;
  var staticParams, staticPass;
  var rgbParams, rgbPass;
  var filmParams, filmPass;
  var renderPass, copyPass, renderPassBuffer;
  var gui;
  var pnoise, globalParams;

  var WIDTH  = window.innerWidth;
  var HEIGHT = window.innerWidth;

  var scene1, scene2;
  var clearMaskPass;
  var maskPass1, maskPass2;

  ///old globals

  var scene, camera, renderer, controls;
  var canvas = document.getElementById('particleCanvas');

  // particles set up
  var particleCount = 100;
  var particles = [];

  init();
  animate();

  function fillScene() {
    var cubeGeometry = new THREE.CubeGeometry(600, 600, 600);

    var particleGeometry = new THREE.SphereGeometry(60, 16, 16); // size, number of polys to form this circle
    var particleMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color( 0x009B24 ),
      transparent: true,
      opacity: 0.5,
      wireframe: true
    });

    var cubeMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color( 0x009B24 ),
      //transparent: true,
      //opacity: 0.5,
      //wireframe: true
    });

    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    //scene1.add(cube);

    // create a random set of particles
    for (var i = 0; i < particleCount; i++) {

      particles[i] = new THREE.Mesh( particleGeometry, particleMaterial );

      //randomize positions
      particles[i].position.x = Math.random() * window.innerWidth * 2 - window.innerWidth;;
      particles[i].position.y = Math.random() * window.innerHeight * 2 - window.innerHeight;
      particles[i].position.z = Math.random() * window.innerWidth * 2 - window.innerWidth;

      particles[i]. direction = {
        x: Math.random(),
        y: Math.random(),
        z: Math.random()
      }
      //particles[i].wireframe = true;

      //scene.add(particles[i]);
      //scene1.add(particles[i]);
      split(particles, i);
    }
  }

function split (particles, i) {
  if(i%2==0){
    scene.add(particles[i]);
    //sceneNo.add(particles[i]);
  } else{
    //sceneNo.add(particles[i]);
    scene.add(particles[i]);
  }
}

function init() {

  sceneEmpty = new THREE.Scene();
  scene = new THREE.Scene();
  //sceneNo = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;

  //cameraNo = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  //cameraNo.position.z = 1000;

  renderer = new THREE.WebGLRenderer();
  //renderer.autoClear = false;
  //renderer.setClearColor( 0x0A202D, 1);
  renderer.setSize( window.innerWidth, window.innerHeight);

  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;

  fillScene();
  canvas.appendChild( renderer.domElement );
  //renderer.render( scene, camera );

  initLights();

  const renderTargetParameters = {
			        minFilter:      THREE.LinearFilter,
			        magFilter:      THREE.LinearFilter,
			        format:         THREE.RGBAFormat,
			        stencilBuffer:  true
			    };
  renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);


  effectComposer = new THREE.EffectComposer( renderer, renderTarget);

  clearMask = new THREE.ClearMaskPass();
  maskPass = new THREE.MaskPass(scene, camera);

  //SWITCH SCENE1 AND SCENE FOR DIFFEREENT EFFECTS

  renderPass = new THREE.RenderPass(scene, camera);
  //renderPassNo = new THREE.RenderPass(sceneNo, cameraNo);
  renderPassEmpty = new THREE.RenderPass(sceneEmpty, camera);

  renderPass.clear = false;
  renderPassEmpty.clear = false;
  //renderPassNo.clear = false;

  copyPass = new THREE.ShaderPass( THREE.CopyShader );
  badTVPass = new THREE.ShaderPass( THREE.BadTVShader );
  staticPass = new THREE.ShaderPass( THREE.StaticShader );
  rgbPass = new THREE.ShaderPass( THREE.RGBShiftShader );
  filmPass = new THREE.ShaderPass( THREE.FilmShader );

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

  onToggleShaders();
  onToggleMute();
  onParamsChange();

  renderer.domElement.addEventListener('click', randomizeParams, false);
  window.addEventListener('resize', onResize, false);

  onResize();
  randomizeParams();
}

function animate() {
  for (var i = 0; i < particleCount; i++) {
    particles[i].position.x += particles[i].direction.x;
    particles[i].position.y += particles[i].direction.y;

    // if edge is reached, bounce back
    if (particles[i].position.x < -window.innerWidth ||
    particles[i].position.x > window.innerWidth) {
      particles[i].direction.x = -particles[i].direction.x;
    }
    if (particles[i].position.y < -window.innerHeight ||
    particles[i].position.y > window.innerHeight) {
      particles[i].direction.y = -particles[i].direction.y;
    }
  }
    shaderTime += 0.1;
    badTVPass.uniforms[ 'time' ].value =  shaderTime;
    filmPass.uniforms[ 'time' ].value =  shaderTime;
    staticPass.uniforms[ 'time' ].value =  shaderTime;

    requestAnimationFrame(animate);
    $( window ).scroll(function() {
      badTVPass.enabled = false;
      staticPass.enabled = false;
      rgbPass.enabled = false;
      filmPass.enabled = false;
      effectComposer.reset();
      randomizeParams();
    });

    badTVPass.enabled = true;
    staticPass.enabled = true;
    rgbPass.enabled = true;
    filmPass.enabled = true;

    renderer.autoClear = false;
    renderer.clear();
    effectComposer.render(0.1);
}

function onToggleShaders(){
  effectComposer.addPass(renderPass);

  effectComposer.addPass(renderPassEmpty);
  //effectComposer.addPass(renderPassNo);

  effectComposer.addPass( maskPass );

  effectComposer.addPass(filmPass);
  effectComposer.addPass(badTVPass);
  effectComposer.addPass(rgbPass);
  effectComposer.addPass(staticPass);

  effectComposer.addPass(clearMask);
  effectComposer.addPass(copyPass);
  copyPass.renderToScreen = true;
}

function onMouseMove(event) {
      var rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
      mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
    }

function drawVideo(){
  var c = canvas;
  var v = video;
  var video_width = v.offsetWidth;
  var video_height = v.offsetHeight;
  ctx.drawImage(video, 0,0, canvas.width, canvas.height);

}

function mouseHover(event){
  //console.log(mouse);
  raycaster.setFromCamera(mouse, mainCamera);
  intersects = raycaster.intersectObject(screenMesh.children[0]);
  if (intersects.length !== 0) {
    badTVPass.enabled = true;
    staticPass.enabled = true;
    rgbPass.enabled = true;
    filmPass.enabled = true;
    //cssObject.visible = true;
    //cssObject.enabled = true;
    //console.log("IT WORKS");
    cssObject.element.hidden = false;
  } else {
    randomizeParams();
    badTVPass.enabled = false;
    staticPass.enabled = false;
    rgbPass.enabled = false;
    filmPass.enabled = false;
    //cssObject.visible = false;
    //cssObject.enabled = false;
    cssObject.element.hidden = true;
  }
}

function initLights() {
  var ambientLight = new THREE.AmbientLight( 0x222222 ); // soft white light
  scene.add( ambientLight );
  //sceneNo.add( ambientLight );

  var pointLight = new THREE.PointLight( 0xffffff, 1, 10000);
  pointLight.position.set(-100, 10, -5 );
  scene.add( pointLight );
  //sceneNo.add( pointLight );


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

  badTVParams.distortion = Math.random()*10+0.1;
  badTVParams.distortion2 =Math.random()*10+0.1;
  badTVParams.speed =Math.random()*0.4;
  badTVParams.rollSpeed =Math.random()*0.2;
  rgbParams.angle = Math.random()*2;
  rgbParams.amount = Math.random()*0.03;
  staticParams.amount = Math.random()*0.2;
  onParamsChange();
}

function onToggleMute(){
  //video.volume  = badTVParams.mute ? 0 : 1;
}

function onResize() {


  WIDTH  = window.innerWidth;
  newHEIGHT = window.innerWidth;
  effectComposer.reset();
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / newHEIGHT;
  camera.updateProjectionMatrix();

}

})();
