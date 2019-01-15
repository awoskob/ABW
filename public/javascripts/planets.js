

var texture
init()
//render()
function init() {
  var stats = initStats()

  var sceneEarth = new THREE.Scene()
  var sceneMars = new THREE.Scene()
  var sceneBG = new THREE.Scene()

  var camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000
  )
  var cameraBG = new THREE.OrthographicCamera(
    -window.innerWidth, window.innerWidth,
    window.innerHeight, -window.innerHeight,
    -10000, 10000,
  )
  cameraBG.position.z = 50

  var webGLRenderer = new THREE.WebGLRenderer()
  webGLRenderer.setClearColor(new THREE.Color(0x000))
  webGLRenderer.setSize(window.innerWidth, window.innerHeight)
  webGLRenderer.shadowMap.enabled = true

  var sphere = createEarthMesh(new THREE.TorusGeometry(10, 5, 5))
  sphere.position.x = -10

  var sphere2 = createMarsMesh(new THREE.CubeGeometry(5, 5, 5))
  sphere2.position.x = 10
  sceneEarth.add(sphere)
  sceneMars.add(sphere2)

  camera.position.x = -10
  camera.position.y = 15
  camera.position.z = 25
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  var orbitControls = new THREE.OrbitControls(camera)
  orbitControls.autoRotate = false

  var clock = new THREE.Clock()

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

  var textureLoader = new THREE.TextureLoader()
  //var materialColor = new THREE.MeshBasicMaterial({
    //map: textureLoader.load(mycdn + '/assets/textures/starry-deep-outer-space-galaxy.jpg'),
    //depthTest: false,
  //})
  //var bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1))
  //bgPlane.position.z = -100
  //bgPlane.scale.set(window.innerWidth * 2, window.innerHeight * 2, 1)
  //sceneBG.add(bgPlane)

  document.getElementById('WebGL-output').appendChild(webGLRenderer.domElement)

  var bgPass = new THREE.RenderPass(sceneBG, cameraBG)
  var renderPass = new THREE.RenderPass(sceneEarth, camera)
  renderPass.clear = false
  var renderPass2 = new THREE.RenderPass(sceneMars, camera)
  renderPass2.clear = false

  var effectCopy = new THREE.ShaderPass(THREE.CopyShader)
  effectCopy.renderToScreen = true

  var clearMask = new THREE.ClearMaskPass()
  // earth mask
  var earthMask = new THREE.MaskPass(sceneEarth, camera)
  // mars mask
  var marsMask = new THREE.MaskPass(sceneMars, camera)

  //var effectSepia = new THREE.ShaderPass(THREE.SepiaShader)
  //effectSepia.uniforms['amount'].value = 0.8

  //var effectColorify = new THREE.ShaderPass(THREE.ColorifyShader)
  //effectColorify.uniforms['color'].value.setRGB(0.5, 0.5, 1)

  //var composer = new THREE.EffectComposer(webGLRenderer)
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
  //composer = new THREE.EffectComposer( renderer, renderTarget);

  composer = new THREE.EffectComposer(webGLRenderer, renderTarget)

  composer.renderTarget1.stencilBuffer = true;
  composer.renderTarget2.stencilBuffer = true;

  //composer.addPass(bgPass);
  composer.addPass(renderPass);
  composer.addPass(renderPass2);
  //composer.addPass(marsMask)
//  composer.addPass(effectColorify)
  //composer.addPass(clearMask)
  //composer.addPass(earthMask)
  //composer.addPass(effectSepia)
  //composer.addPass(clearMask)
  composer.addPass(effectCopy);

  function createMarsMesh(geom) {
    //var textureLoader = new THREE.TextureLoader()
    //var planetTexture = textureLoader.load(mycdn + '/assets/textures/planets/Mars_2k-050104.png')
    //var normalTexture = textureLoader.load(mycdn + '/assets/textures/planets/Mars-normalmap_2k.png')
    var planetMaterial = new THREE.MeshPhongMaterial()
  //planetMaterial.normalMap = normalTexture
    //planetMaterial.map = planetTexture

    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial])

    return mesh
  }

  function createEarthMesh(geom) {
    var textureLoader = new THREE.TextureLoader()
    //var planetTexture = textureLoader.load(mycdn + '/assets/textures/planets/Earth.png')
    //var specularTexture = textureLoader.load(mycdn + '/assets/textures/planets/EarthSpec.png')
    //var normalTexture = textureLoader.load(mycdn + '/assets/textures/planets/EarthNormal.png')

    var planetMaterial = new THREE.MeshPhongMaterial()
    //planetMaterial.specularMap = specularTexture
    planetMaterial.specular = new THREE.Color(0xffffff)
    //planetMaterial.normalMap = normalTexture
    //planetMaterial.map = planetTexture

    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial])
    return mesh
  }

  var step = 0
  render()


  function render() {
    //stats.update()

    webGLRenderer.autoClear = false

    var delta = clock.getDelta()
    orbitControls.update(delta)

    sphere.rotation.y += 0.002
    sphere2.rotation.y += 0.002

    requestAnimationFrame(render)
    composer.render(.1)
  }
}


function initStats() {
  var stats = new Stats()

  stats.setMode(0)

  stats.domElement.style.position = 'absolute'
  stats.domElement.style.left = '0px'
  stats.domElement.style.top = '0px'

  //document.getElementById('Stats-output').appendChild(stats.domElement)

  return stats
}
window.onload = init
