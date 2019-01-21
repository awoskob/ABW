(function tvlayoutgroup(){

  var camera, scene, renderer, mesh, material, canvas, dimensions;

  var effectComposer, buffer, mainCamera, mainScene, mainMesh;

  var camera, scene, renderer;
  var video, videoTexture, videoMaterial, videoMaterialPost;
  var videoMaterials = [];
  var videoMaterialsPost = [];
  var videos = [];
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

  var divScale = 2;
  var WIDTH;
  var HEIGHT;

  var scene1, scene2;
  var clearMaskPass;
  var maskPass1, maskPass2;

  var buffer, bufferTexture, ctx, texture, bufferScene, bufferRenderer, bufferCamera;

  var raycaster = new THREE.Raycaster();
  var projector, mouse = {
    x: 0,
    y: 0
  }, INTERSECTED;
  var intersects = [];

  var cssRenderer;
  var cssGroup = [];
  var cssScene;
  //var cssGroup;
  var cssObject1 = null;

  var mouse3D;

  var tvScreenArray = [];
  var tvArray = [];
  var tvGroup;
  //var tvCol = 4;
  //var tvRow = 5;
  var tvCol = 3;
  var tvRow = 5;

  //var zpos = -120;
  //var ypos = -50;

  var canvasGroup = []
  var ctxGroup = [];
  var textureGroup = [];
  var bufferGroup = [];
  var effectComposerGroup = [];
  var sceneGroup = [];
  var renderPassGroup = [];
  var topOver = false;
  var bottomOver = false;
  var entered = false;
  var exited = true;
  var hammerMesh;
  var textArray = ["LET'S GO!", "HAVE YOU NO COURAGE?",
                  "TIME IS OF THE ESSENCE!", "YOU CAN DO IT!"];
  var textIndex = 0;

  var cardArray = [];
  var cardIndex = 0;

  var urlArray = ["/work/solowork/youresofine", "/work/solowork/proceduralanimation",
                "/work/solowork/machinelearningunity", "/work/solowork/prokofiev7",
                "/work/solowork/gravitysound", "/work/groupwork/birdcycle",
                "/work/solowork/goldmarkviolin", "/work/solowork",
                "/work/solowork", "/work/solowork",
                "/work/solowork", "/work/solowork",
                "/work/solowork", "/work/solowork", "/work/solowork"];
  //var zpos = -100;
  //var xleft = -.016 * WIDTH;
  //var xdelta = .016 * WIDTH;
  //var tvscalex = .00008 * WIDTH;
  //var tvscaley = .000045 * HEIGHT;

function resizeTV() {
  var zpos = -100;
  //var xdelta = .01115 * WIDTH;
  var xdelta = .0253 * WIDTH;
  var tvscalex = .000205 * WIDTH;
  var tvscaley = .00016 * HEIGHT;
  var ytop = .028 * HEIGHT;
  var index = 0;
  var rotx = 0.5;

  for (var row = 0; row < tvRow; row++) {
    var roty = 0.7;

    ypos = ytop;
    var xleft = -.026 * WIDTH;
      console.log("XLEFT =" + xleft);
      for (var col = 0; col < tvCol ; col++) {
        if(index < 15) {
          xpos = xleft;
          var ydelta = .0165 * HEIGHT;
          roty -= (col * 0.7)
          if(col == 2) {
            roty = -.7;
          }

          var screenMesh = screenGroup.children[index];
          screenMesh.position.z = zpos;
          screenMesh.position.y = ypos;
          screenMesh.position.x = xpos;
          screenMesh.rotation.y = roty;
          screenMesh.rotation.x = rotx;
          screenMesh.scale.x = screenMesh.scale.z = tvscalex;

          screenMesh.scale.y = tvscaley;
          index1 = screenMesh.userData.id;

          tvMesh = tvArray[index];
          tvMesh.position.z = zpos;
          tvMesh.position.y = ypos;
          tvMesh.position.x = xpos;
          tvMesh.rotation.y = roty;
          tvMesh.rotation.x = rotx;
          tvMesh.scale.x = tvMesh.scale.z = tvscalex;
          tvMesh.scale.y = tvscaley;

          cssButton = cssGroup[index];
          cssButton.position.x  = xpos - (WIDTH * .002);
          cssButton.position.y  = ypos + (HEIGHT * .045);
          cssButton.position.z  = zpos;
          cssButton.rotation.copy(screenMesh.rotation);
          cssButton.scale.x = cssButton.scale.y = cssButton.scale.z = 0.25;
          cssScene.add(cssButton);

          index += 1;
          xleft += xdelta;
        }
      }
      rotx -= 0.25;
      ytop -= ydelta;
  }
}


function loadTVs() {

  console.log("WIDTH =" + WIDTH);
  console.log("HEIGHT =" + HEIGHT);
  //var zpos = -100;
  //var xleft = -.0114 * WIDTH;
  //var xdelta = .01115 * WIDTH;
  //var tvscalex = .00009 * WIDTH;
  //var tvscaley = .000045 * HEIGHT;

  var zpos = -100;
  //var xdelta = .01115 * WIDTH;
  var xdelta = .0253 * WIDTH;
  var tvscalex = .000205 * WIDTH;
  var tvscaley = .00016 * HEIGHT;
  var ytop = .028 * HEIGHT;
  var index = 0;
  var rotx = 0.5;
  console.log("WIDTH =" + WIDTH);
  console.log("HEIGHT =" + HEIGHT);
  loader = new THREE.OBJLoader();
  loader.load('../models/yellowtvscreen.obj', function(object) {
    screenGroup = new THREE.Object3D();
    tvGroup = new THREE.Object3D();
    var index = 0;
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          for (var row = 0; row < tvRow; row++) {
              var roty = 0.7;

              ypos = ytop;
              var xleft = -.026 * WIDTH;

              for (var col = 0; col < tvCol ; col++) {
                if(index < 15) {
                  xpos = xleft;
                  var ydelta = .0165 * HEIGHT;
                  roty -= (col * 0.7)
                  if(col == 2) {
                    roty = -.7;
                  }

                  var screenMesh = new THREE.Mesh( child.geometry, videoMaterialsPost[index]);
                  screenMesh.position.z = zpos;
                  screenMesh.position.y = ypos;
                  screenMesh.position.x = xpos;
                  screenMesh.rotation.y = roty;
                  screenMesh.rotation.x = rotx;
                  screenMesh.scale.x = screenMesh.scale.z = tvscalex;

                  screenMesh.scale.y = tvscaley;
                  screenMesh.userData.id = index;
                  screenMesh.userData.URL = urlArray[index];

                  screenGroup.add(screenMesh);


                  initTVMesh(zpos, ypos, xpos, roty, rotx, tvscalex, tvscaley);

                  //tvMesh = tvArray[index1];
                  //tvMesh.position.z = zpos;
                  //tvMesh.position.y = ypos;
                  //tvMesh.position.x = xpos;
                  //tvMesh.rotation.y = roty;
                  //tvMesh.rotation.x = rotx;
                  //tvMesh.scale.x = tvMesh.scale.z = tvscalex;
                  //tvMesh.scale.y = tvscaley;

                  cssButton = cssGroup[index];
                  cssButton.position.x  = xpos - (WIDTH * 0);
                  cssButton.position.y  = ypos + (HEIGHT * 0);
                  cssButton.position.z  = zpos;
                  cssButton.rotation.copy(screenMesh.rotation);
                  cssButton.scale.x = cssButton.scale.y = cssButton.scale.z = 0.25;
                  cssScene.add(cssButton);

                  index += 1;
                  xleft += xdelta;
                }
              }
              rotx -= 0.25;
              ytop -= ydelta;
          }
        }
    });
    //resizeTV(screenGroup);
    console.log("LENGTH2 =" + screenGroup.length);
    initHammerMesh();

    mainScene.add(screenGroup);
    //resizeTV(screenGroup);
  });
}

init();
animate();

function initHomeCards() {
  card1 = document.getElementById("card1");
  cardArray.push(card1);
  card2 = document.getElementById("card2");
  cardArray.push(card2);
  card3 = document.getElementById("card3");
  cardArray.push(card3);
  card4 = document.getElementById("card4");
  cardArray.push(card4);
  card5 = document.getElementById("card5");
  cardArray.push(card5);
  card6 = document.getElementById("card6");
  cardArray.push(card6);
  card7 = document.getElementById("card7");
  cardArray.push(card7);
  card8 = document.getElementById("card8");
  cardArray.push(card8);
  card9 = document.getElementById("card9");
  cardArray.push(card9);
  card10 = document.getElementById("card10");
  cardArray.push(card10);
  card11 = document.getElementById("card11");
  cardArray.push(card11);
  card12 = document.getElementById("card12");
  cardArray.push(card12);
  card13 = document.getElementById("card13");
  cardArray.push(card13);
  card14 = document.getElementById("card13");
  cardArray.push(card14);
  card15 = document.getElementById("card13");
  cardArray.push(card15);
}


function initCSS() {
  var scale = 0.2;
  cssRenderer = new THREE.CSS3DRenderer();
  cssRenderer.setSize(WIDTH,HEIGHT);
  cssScene = new THREE.Scene()
  //cssGroup = new THREE.Object3D;

  initButtons(scale);

  cssRenderer.domElement.style.position = 'absolute';
  document.getElementById("tvlayoutcanvas").appendChild(cssRenderer.domElement);

}

function initButtons(scale) {
  element1 = document.getElementById("layoutfire1");
  element2 = document.getElementById("layoutfire2");
  element3 = document.getElementById("layoutfire3");
  element4 = document.getElementById("layoutfire4");
  element5 = document.getElementById("layoutfire5");
  element6 = document.getElementById("layoutfire6");
  element7 = document.getElementById("layoutfire7");
  element8 = document.getElementById("layoutfire8");
  element9 = document.getElementById("layoutfire9");
  element10 = document.getElementById("layoutfire10");
  element11 = document.getElementById("layoutfire11");
  element12 = document.getElementById("layoutfire12");
  element13 = document.getElementById("layoutfire13");
  element14 = document.getElementById("layoutfire14");
  element15 = document.getElementById("layoutfire15");
  cssObject1 = new THREE.CSS3DObject(element1);
  cssGroup.push(cssObject1);
  cssObject2 = new THREE.CSS3DObject(element2);
  cssGroup.push(cssObject2);
  cssObject3 = new THREE.CSS3DObject(element3);
  cssGroup.push(cssObject3);
  cssObject4 = new THREE.CSS3DObject(element4);
  cssGroup.push(cssObject4);
  cssObject5 = new THREE.CSS3DObject(element5);
  cssGroup.push(cssObject5);
  cssObject6 = new THREE.CSS3DObject(element6);
  cssGroup.push(cssObject6);

  cssObject7 = new THREE.CSS3DObject(element7);
  cssGroup.push(cssObject7);
  cssObject8 = new THREE.CSS3DObject(element8);
  cssGroup.push(cssObject6);
  cssObject9 = new THREE.CSS3DObject(element9);
  cssGroup.push(cssObject9);
  cssObject10 = new THREE.CSS3DObject(element10);
  cssGroup.push(cssObject10);
  cssObject11 = new THREE.CSS3DObject(element11);
  cssGroup.push(cssObject11);
  cssObject12 = new THREE.CSS3DObject(element12);
  cssGroup.push(cssObject12);
  cssObject13 = new THREE.CSS3DObject(element13);
  cssGroup.push(cssObject13);
  cssObject14 = new THREE.CSS3DObject(element14);
  cssGroup.push(cssObject14);
  cssObject15 = new THREE.CSS3DObject(element15);
  cssGroup.push(cssObject15);
}

function initCanvas() {
  for(var i = 0; i < 15; i ++) {
    scene = new THREE.Scene();
    prenum = i + 1;
    canvasnum = prenum.toString();
    canvasname = "layoutcanvas";
    id = canvasname.concat(canvasnum);
    canvas = document.getElementById(id);
    canvas.style.display="none";
    canvas.width = 512;
    canvas.height = 512;
    ctx = canvas.getContext("2d");
    texture = new THREE.CanvasTexture(canvas);
    canvasGroup[i] = canvas;
    ctxGroup[i] = ctx;
    textureGroup[i] = texture;

    buffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    buffer.texure = texture;
    effectComposer = new THREE.EffectComposer(renderer, buffer);

    bufferGroup[i] = buffer;
    effectComposerGroup[i] = effectComposer;

    material = new THREE.MeshBasicMaterial({map: texture});
    geometry = new THREE.PlaneBufferGeometry( 2, 2 );
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    sceneGroup[i] = scene;
  }
}


function init() {
    initVideoPreBuffer();
    console.log("start");
    initCSS();
    //initTVMesh();

    //BGCOLOR
    renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});
    //renderer = new THREE.WebGLRenderer();
    //renderer.setClearColor (0xff0000, 1);

		dimensions = renderer.getSize()
		tvlayout = document.getElementById("tvlayoutcanvas");
    console.log("TVLAYOUT =" + tvlayout);
    WIDTH = $(tvlayout).width();
    HEIGHT = $(tvlayout).height();

    renderer.setSize(WIDTH, HEIGHT);
    tvlayout.appendChild(renderer.domElement);

    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    //scene = new THREE.Scene();
    //resizeCanvasToDisplaySize();
    initCanvas();
    //initBuffers();

    mainCamera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 1, 1000 );
    mainCamera.position.z = 50;
    mainScene = new THREE.Scene();

    //initCSS();
    initHomeCards();
    initVideoPostBuffer();
    initLights();
    //initScreenMesh();
    //initTVMesh();
    loadTVs();

    for(var i = 0; i < 15; i ++) {
      renderPass = new THREE.RenderPass(sceneGroup[i], camera);
      renderPassGroup[i] = renderPass;
    }
    //renderPass = new THREE.RenderPass(sceneGroup[0], camera);
    copyPass = new THREE.ShaderPass( THREE.CopyShader );
    badTVPass = new THREE.ShaderPass( THREE.BadTVShader );
    staticPass = new THREE.ShaderPass( THREE.StaticShader );
    rgbPass = new THREE.ShaderPass( THREE.RGBShiftShader );
    filmPass = new THREE.ShaderPass( THREE.FilmShader );

    filmPass.uniforms.grayscale.value = 0;

    copyPass2 = new THREE.ShaderPass( THREE.CopyShader );
    badTVPass2 = new THREE.ShaderPass( THREE.BadTVShader );
    staticPass2 = new THREE.ShaderPass( THREE.StaticShader );
    rgbPass2 = new THREE.ShaderPass( THREE.RGBShiftShader );
    filmPass2 = new THREE.ShaderPass( THREE.FilmShader );

    filmPass2.uniforms.grayscale.value = 0;

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
    document.addEventListener('mousedown', onDocumentMouseDown, false);


    onResize();
    randomizeParams();
}

document.getElementById('tvlayoutcanvas').onmouseover = function () {
    //hammerMesh.visible = true;
}

document.getElementById('tvlayoutcanvas').onmouseout = function () {
    //hammerMesh.visible = false;
}

function onMouseMove(event) {
      var rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
      mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

      mouse3D = new THREE.Vector3(
        ( event.clientX / WIDTH ) * 2 - 1,
        - ( event.clientY / HEIGHT ) * 2 + 1,
        0.5 );
      if(hammerMesh != null) {
        var vector = new THREE.Vector3(mouse.x, mouse.y, -80);
      	vector.unproject( mainCamera );
      	var dir = vector.sub( mainCamera.position ).normalize();
      	var distance = - mainCamera.position.z / dir.z;
      	var pos = mainCamera.position.clone().add( dir.multiplyScalar( distance ) );
        //pos.z = -80;
        //pos.y -= 5;
        //console.log("POS = " + pos.x + pos.y);
      	hammerMesh.position.copy(pos);
        //hammerMesh.position.z = -80;
        //hammerMesh.position.x = mouse3D.x;
        //hammerMesh.position.y = mouse3D.y;
      }

    }

function drawVideo(){
  for(var i = 0; i < 15; i ++) {
    if(i == 0 || i ==5) {
      var c = canvasGroup[i];
      var v = videos[i];
      ctx = ctxGroup[i];
      ctx.save();
      ctxGroup[i].drawImage(v, 0,0, c.width, c.height);
      ctx.scale(1, dimensions.width / dimensions.height);
    } else {
      var c = canvasGroup[i];
      var v = videos[i];
      var video_width = v.offsetWidth;
      var video_height = v.offsetHeight;

      ctx = ctxGroup[i];
      ctx.save();
      ctxGroup[i].drawImage(v, 0,0, c.width, c.height);
      ctx.scale(1, dimensions.width / dimensions.height);
    }
  }
}

function ctxRestore() {
  for(var i = 0; i < 15; i ++) {
    ctx = ctxGroup[i];
    ctx.restore();
    textureGroup[i].needsUpdate = true;
  }
}

function onDocumentMouseDown(event) {
    raycaster.setFromCamera(mouse, mainCamera);
    var intersects = raycaster.intersectObjects(screenGroup.children);
    if (intersects.length !== 0) {
      path = intersects[0].object.userData.URL;
      window.location.href = path;
    }
};

function mouseHover(event){
  raycaster.setFromCamera(mouse, mainCamera);
  intersects = raycaster.intersectObjects(screenGroup.children);
  if (intersects.length !== 0) {


    index = intersects[0].object.userData.id;
    if(index < 7) {
      hammerMesh.visible = true;
      $('html,body').css('cursor', 'none');
      hammerMesh.lookAt(intersects[0].object.position);
      if(index % 3 == 0) {
        hammerMesh.rotation.y -= 0.5;
      }
      if(index % 3 == 2) {
        hammerMesh.rotation.y += 0.5;
      }
      exited = false;
      //cssGroup[index].element.hidden = false;
      badTVPass.enabled = true;
      staticPass.enabled = true;
      rgbPass.enabled = true;
      filmPass.enabled = true;
      if(entered == false) {

        for (i = 0; i < 15; i ++) {
          if(i != index) {
            if(videos[i].nodeName == "video") {
              videos[i].pause();
            }
            videos[i] = cardArray[index]
            entered = true;
          }
        }

    }
    }

  } else {
    $('html,body').css('cursor', 'default');
    hammerMesh.visible = false;

    badTVPass.enabled = false;
    staticPass.enabled = false;
    rgbPass.enabled = false;
    filmPass.enabled = false;
    //randomizeParams()
    hideButtons();
    if(exited == false) {
      randomizeParams();
      textIndex += 1;
      exited = true;
      initVideoMaterials()
    }
    entered = false;
  }
}

function hideButtons() {
  for(var i = 0; i < cssGroup.length; i++) {
    cssGroup[i].element.hidden = true;
  }
}

function mouseHoverPre() {
  if(screenGroup != null && hammerMesh != null) {
    mouseHover(event);
  }
}

function renderEffectComposer(time) {
  for(var i = 0; i < 15; i++) {
    effectComposer = effectComposerGroup[i];
    effectComposer.render(time);
  }
}

function effectComposerSwapBuffers() {
  for(var i = 0; i < 15; i++) {
    effectComposer = effectComposerGroup[i];
    effectComposer.swapBuffers();
  }
}

function animate() {
    //resizeCanvasToDisplaySize();
    //resizeTV();
    mouseHoverPre();
    drawVideo();

    shaderTime += 0.1;
    badTVPass.uniforms[ 'time' ].value =  shaderTime;
    filmPass.uniforms[ 'time' ].value =  shaderTime;
    staticPass.uniforms[ 'time' ].value =  shaderTime;

    badTVPass2.uniforms[ 'time' ].value =  shaderTime;
    filmPass2.uniforms[ 'time' ].value =  shaderTime;
    staticPass2.uniforms[ 'time' ].value =  shaderTime;

    ctxRestore();
    renderEffectComposer(.1);
    renderer.render(mainScene, mainCamera);
    cssRenderer.render(cssScene, mainCamera);
    requestAnimationFrame(animate);
    effectComposerSwapBuffers();
}

function onToggleShaders(){

  for(var i = 0; i < 15; i ++) {
    effectComposer = effectComposerGroup[i];
    effectComposer.addPass(renderPassGroup[i]);
    effectComposer.addPass(filmPass);
    effectComposer.addPass(badTVPass);
    effectComposer.addPass(rgbPass);
    effectComposer.addPass(staticPass);
    effectComposer.addPass(copyPass);
  };
}

function initLights() {
  var light1 = new THREE.AmbientLight( 0x777777 ); // soft white light
  mainScene.add( light1 );

  var light = new THREE.PointLight( 0xffffff, 1, 2000);
  light.position.set(-20, 15, -50 );
  mainScene.add( light );

  var light = new THREE.PointLight( 0xffffff, 1, 200);
  light.position.set(-10, -10, 10 );
  mainScene.add( light );


}


function initHammerMesh() {
  console.log("INIT HAMMER");
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load('../models/Hammer03.mtl', function (materials) {
      tvGroup = new THREE.Object3D();
      materials.preload();
      var loader = new THREE.OBJLoader();
      loader.setMaterials(materials)
      loader.load('../models/Hammer03.obj', function(geometry, materials) {
          hammerMesh = geometry;
          hammerMesh.scale.x = hammerMesh.scale.y = hammerMesh.scale.z = .07;
          hammerMesh.position.y = -10;
          hammerMesh.position.z = -80;
          hammerMesh.lookAt(tvArray[1]);
          //hammerMesh.rotation.x = -.9;
        //  hammerMesh.rotation.z = -.5;
          mainScene.add(hammerMesh);
          hammerMesh.visible = false;
      });
  });
}

function initTVMesh(zpos, ypos, xpos, roty, rotx, tvscalex, tvscaley) {
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load('../models/yellowtv.mtl', function (materials) {
      tvGroup = new THREE.Object3D();
      materials.preload();
      var loader = new THREE.OBJLoader();
      loader.setMaterials(materials)
      loader.load('../models/yellowtv.obj', function(geometry, materials) {
          tvMesh = geometry;
          tvMesh.position.z = zpos;
          tvMesh.position.y = ypos;
          tvMesh.position.x = xpos;
          tvMesh.rotation.y = roty;
          tvMesh.rotation.x = rotx;
          tvMesh.scale.x = tvMesh.scale.z = tvscalex;
          tvMesh.scale.y = tvscaley;
          tvGroup.add(tvMesh);
          tvArray.push(tvMesh);

          console.log("TVARRAYLENGTH =" + tvArray.length)
          mainScene.add(tvMesh);
      });
  });
}

function initVideoMaterials() {
  for(var i = 0; i < 15; i ++) {

      if(i > 6) {
        img = document.getElementById("SoloWork");
        imgTexture = new THREE.Texture( img );
        imgTexture.minFilter = THREE.LinearFilter;
        imgTexture.magFilter = THREE.LinearFilter;

        imgMaterial = new THREE.MeshBasicMaterial( {
          map: imgTexture
        } );
        videoMaterials[i] = imgMaterial;
        videos[i] = img;

      } else {
        prenum = i+1;
        videonum = prenum.toString();
        videoname = "stock";
        id = videoname.concat(videonum);
        console.log("VIDEONAME = " + id);
        video = document.getElementById( id );
        console.log("VIDEOSRC = " + video.src);
        video.loop = true;
        video.muted = true;
        if(video.paused = true) {
          video.play();
        }
        videos[i] = video;
        videoTexture = new THREE.Texture( video );
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;

        videoMaterial = new THREE.MeshBasicMaterial( {
          map: videoTexture
        } );

        videoMaterials[i] = videoMaterial;
      }
    }
}


function initVideoPreBuffer() {
  initVideoMaterials();
}

function initVideoPostBuffer() {
  for(var i = 0; i < 15; i ++) {
    texture = bufferGroup[i].texture;
    videoMaterialPost = new THREE.MeshBasicMaterial( {
      map: texture
    } );
    videoMaterialsPost[i] = videoMaterialPost;
  }
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
  //2
  badTVPass2.uniforms[ 'distortion' ].value = badTVParams.distortion;
  badTVPass2.uniforms[ 'distortion2' ].value = badTVParams.distortion2;
  badTVPass2.uniforms[ 'speed' ].value = badTVParams.speed;
  badTVPass2.uniforms[ 'rollSpeed' ].value = badTVParams.rollSpeed;

  staticPass2.uniforms[ 'amount' ].value = staticParams.amount;
  staticPass2.uniforms[ 'size' ].value = staticParams.size;

  rgbPass2.uniforms[ 'angle' ].value = rgbParams.angle*Math.PI;
  rgbPass2.uniforms[ 'amount' ].value = rgbParams.amount;

  filmPass2.uniforms[ 'sCount' ].value = filmParams.count;
  filmPass2.uniforms[ 'sIntensity' ].value = filmParams.sIntensity;
  filmPass2.uniforms[ 'nIntensity' ].value = filmParams.nIntensity;
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
  WIDTH = $(tvlayout).width();
  HEIGHT = $(tvlayout).height();
  if(screenGroup != null && tvArray != null) {
    //console.log("SL =" + screenGroup.children.length)
    //console.log("TL =" + tvArray.length)
    resizeTV();
  }


  renderer.setSize(WIDTH, HEIGHT);
  cssRenderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();

  mainCamera.aspect = WIDTH / HEIGHT;
  mainCamera.updateProjectionMatrix();
}

})();
