(function buffercomp(){

  var camera, scene, renderer, mesh, material, ctx, texture, canvas, dimensions;

  var effectComposer, buffer, mainCamera, mainScene, mainMesh;

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

  var screenMesh = null;
  var tvMesh;
  var screenGroup;

  var divScale = 2.5;
  var WIDTH  = window.innerWidth / divScale;
  var HEIGHT = window.innerWidth / divScale;

  var scene1, scene2;
  var clearMaskPass;
  var maskPass1, maskPass2;

  var zdis = -120;
  var ydis = -40;
  var tvscale = 1;

  var buffer, bufferTexture, ctx, texture, bufferScene, bufferRenderer, bufferCamera;

  var raycaster = new THREE.Raycaster();
  var projector, mouse = {
    x: 0,
    y: 0
  },
  INTERSECTED;
  var intersects = [];

  var cssRenderer;
  var cssObject = null;

init();
animate();

function initBuffer() {
  canvas = document.getElementById("proj1canvas");
  canvas.style.display="none";
  canvas.width = 512;
  canvas.height = 512;
  ctx = canvas.getContext("2d");
  texture = new THREE.CanvasTexture(canvas);
  buffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  buffer.texure = texture;
  effectComposer = new THREE.EffectComposer(renderer, buffer);
  material = new THREE.MeshBasicMaterial({map: texture});
  var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function init() {
    initVideoPreBuffer();

    console.log("start");

    button = document.getElementById("fire");


    cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize(WIDTH,HEIGHT);
    cssScene = new THREE.Scene()
    element = document.getElementById("fire");
    cssObject = new THREE.CSS3DObject(element);
    cssObject.scale.x = cssObject.scale.y = cssObject.scale.z = .1;
    //cssObject.position.x = screenMesh.children[0].geometry.boundingSphere.center.x;
    //cssObject.position.y = screenMesh.children[0].geometry.boundingSphere.center.y;
    //cssObject.position.z = screenMesh.children[0].geometry.boundingSphere.center.z;
    cssObject.position.x = -4.5;
    cssObject.position.y = -5.5;
    cssObject.position.z = 0;
    cssScene.add(cssObject);
    cssRenderer.domElement.style.position = 'absolute';
    document.getElementById("proj1").appendChild(cssRenderer.domElement);


    //renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH,HEIGHT);
		dimensions = renderer.getSize()
		document.getElementById("proj1").appendChild(renderer.domElement);

    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    scene = new THREE.Scene();

    initBuffer();

    mainCamera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 1, 1000 );
    mainCamera.position.z = 50;
    mainScene = new THREE.Scene();

    screenGroup = new THREE.Object3D();
    initVideoPostBuffer();
    initLights();
    initScreenMesh();
    initTVMesh();
    initCSS();

    renderPass = new THREE.RenderPass(scene, camera);
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

    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onResize, false);

    onResize();
    randomizeParams();
}

function initCSS() {

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

function animate() {
    if (screenMesh !== null && cssObject != null) {
      mouseHover(event);
      //console.log(cssObject);
    }
    ctx.save();
    drawVideo();


    ctx.scale(1, dimensions.width / dimensions.height)
    ctx.fillStyle = "#FF0000"
    ctx.fillRect((canvas.width / 2) - 25, (canvas.height / 2) -25, 100, 100);

    shaderTime += 0.1;
    badTVPass.uniforms[ 'time' ].value =  shaderTime;
    filmPass.uniforms[ 'time' ].value =  shaderTime;
    staticPass.uniforms[ 'time' ].value =  shaderTime;


    ctx.restore()
    texture.needsUpdate = true;
    effectComposer.render();
    renderer.render(mainScene, mainCamera);
    cssRenderer.render(cssScene, mainCamera);
    requestAnimationFrame(animate);
    effectComposer.swapBuffers();
}

function onToggleShaders(){
  effectComposer.addPass(renderPass);
  effectComposer.addPass(filmPass);
  effectComposer.addPass(badTVPass);
  effectComposer.addPass(rgbPass);
  effectComposer.addPass(staticPass);
  effectComposer.addPass(copyPass);
}

function initLights() {
  var light1 = new THREE.AmbientLight( 0x111111 ); // soft white light
  mainScene.add( light1 );

  var light = new THREE.PointLight( 0xffffff, 1, 500);
  light.position.set(0, 15, -50 );
  mainScene.add( light );


}

function initScreenMesh() {

  loader = new THREE.OBJLoader();
  loader.load('../models/yellowtvscreen.obj', function(geometry) {
      screenMesh = geometry;
      screenMesh.position.z = zdis;
      screenMesh.position.y = ydis;
      screenMesh.scale.x = screenMesh.scale.y = screenMesh.scale.z = tvscale;
      screenMesh.children[0].material = videoMaterialPost;
      mainScene.add(screenMesh);
  });
}

function initTVMesh() {
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load('../models/yellowtv.mtl', function (materials) {
      materials.preload();
      var loader = new THREE.OBJLoader();
      loader.setMaterials(materials)
      loader.load('../models/yellowtv.obj', function(geometry, materials) {
          tvMesh = geometry;
          tvMesh.position.z = zdis;
          tvMesh.position.y = ydis;
          tvMesh.scale.x = tvMesh.scale.y = tvMesh.scale.z = tvscale;
          tvMesh.translation = geometry.center;
          mainScene.add(tvMesh);
      });
  });
}

function initVideoPreBuffer() {

  video = document.getElementById( 'stock10' );
  video.loop = true;
  video.muted = true;
  video.play();
  //video.src = '../videos';

  //console.log("BUfferCOmp + " + video.src);


  videoTexture = new THREE.Texture( video );
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  videoMaterial = new THREE.MeshBasicMaterial( {
    map: videoTexture
  } );

}

function initVideoPostBuffer() {
  videoMaterialPost = new THREE.MeshBasicMaterial( {
    map: buffer.texture
  } );

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
  WIDTH  = window.innerWidth / divScale;
  HEIGHT = window.innerWidth / divScale;

  renderer.setSize(WIDTH, HEIGHT);
  cssRenderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();

  mainCamera.aspect = WIDTH / HEIGHT;
  mainCamera.updateProjectionMatrix();
}

})();
