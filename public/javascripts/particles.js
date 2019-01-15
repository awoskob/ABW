console.log(69696);



(function particles () {
  var scene, camera, renderer, controls;
  var canvas = document.getElementById('particleCanvas');

  // particles set up
  var particleCount = 100;
  var particles = [];

  init();
  animate();

  function fillScene() {

    var particleGeometry = new THREE.SphereGeometry(60, 16, 16); // size, number of polys to form this circle
    var particleMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color( 0x009B24 ),
      transparent: true,
      opacity: 0.5,
      wireframe: true
    });

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

      scene.add(particles[i]);
    }
  }

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0x0A202D, 1);
    renderer.setSize( window.innerWidth, window.innerHeight*2);

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    fillScene();
    canvas.appendChild( renderer.domElement );
    renderer.render( scene, camera );
    window.addEventListener('resize', onResize, false);
  }

  function animate() {
      requestAnimationFrame( animate );
      controls.update();

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

      renderer.render( scene, camera );
  }

  function onResize() {
    WIDTH  = window.innerWidth;
    HEIGHT = window.innerWidth;

    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

  }


})();
