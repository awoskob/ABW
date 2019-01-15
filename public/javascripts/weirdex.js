<body>

        <div id="container"><canvas width="2280" height="1713" style="width: 1520px; height: 1142px;"></canvas><div style="position: fixed; top: 0px; left: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;"><canvas width="160" height="96" style="width: 80px; height: 48px; display: block;"></canvas><canvas width="160" height="96" style="width: 80px; height: 48px; display: none;"></canvas><canvas width="160" height="96" style="width: 80px; height: 48px; display: none;"></canvas></div></div>

        <script src="js/three.js"></script>

        <script src="js/controls/OrbitControls.js"></script>

        <script src="js/Detector.js"></script>

        <script src="js/shaders/CopyShader.js"></script>
        <script src="js/shaders/HorizontalBlurShader.js"></script>
        <script src="js/shaders/VerticalBlurShader.js"></script>
        <script src="js/shaders/BlendShader.js"></script>

        <script src="js/postprocessing/EffectComposer.js"></script>
        <script src="js/postprocessing/RenderPass.js"></script>
        <script src="js/postprocessing/TexturePass.js"></script>
        <script src="js/postprocessing/ShaderPass.js"></script>
        <script src="js/postprocessing/MaskPass.js"></script>
        <script src="js/postprocessing/SavePass.js"></script>

        <script src="js/Detector.js"></script>
        <script src="js/libs/stats.min.js"></script>
        <script src="js/libs/dat.gui.min.js"></script>

        <script>
            if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

            var container, stats;

            var width = window.innerWidth || 2;
            var height = window.innerHeight || 2;
            var clock = new THREE.Clock();

            var cameraPerspective, renderer;
            var sceneBack, sceneFront;
            var rttPassBack, rttPassFront;
            var composerBack, composerFront, composerMerge;

            var effectBlend;
            var options = {
                blending:.7,
                blurX: .5,
                blurY: .5,
                animate: !true
            }

            var rttParams = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                stencilBuffer: true,
            };

            var sphere, cube, plane;

            var effectHBlur, effectVBlur;

            var loader = new THREE.TextureLoader();

            var textureSphere, textureCube;

            var particleLight;

            init();
            animate();

            function init() {

                var gui = new dat.GUI();
                gui.add( options, 'blending', 0.0, .99, 0.8 ).onChange( function(){
                    effectBlend.uniforms[ 'mixRatio' ].value = options.blending;
                } );
                gui.add( options, 'blurX', 0.0, 5, 1 ).onChange( function(){
                    effectHBlur.uniforms[ 'h' ].value = 2 / ( width / 2 ) * options.blurX;
                } );
                gui.add( options, 'blurY', 0.0, 5, 1 ).onChange( function(){
                    effectVBlur.uniforms[ 'v' ].value = 2 / ( height / 2 ) * options.blurY;
                } );
                gui.add( options, 'animate', false, true, true );

                container = document.getElementById( 'container' );

                cameraPerspective = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 100, 2000000 );
                cameraPerspective.position.set( 0, 120, 200 );

                renderer = new THREE.WebGLRenderer( { antialias: false, alpha:true } );
                renderer.setClearColor( 0x000000, 0 );
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( width, height );
                renderer.autoClear = false;

                container.appendChild( renderer.domElement );

                stats = new Stats();
                container.appendChild( stats.dom );

                // create scenes
                sceneBack = new THREE.Scene();
                sceneFront = new THREE.Scene();

                var geometry, material;

                // Sphere
                geometry = new THREE.SphereGeometry( 125000, 32, 32 );
                textureSphere = loader.load('img/paper-texture.png');
                textureSphere.wrapS = textureSphere.wrapT = THREE.RepeatWrapping;
                textureSphere.repeat.set( 26, 26 );
                material = new THREE.MeshBasicMaterial( {
                    map: textureSphere,
                    side: THREE.DoubleSide,
                } );
                sphere = new THREE.Mesh( geometry, material );
                sceneBack.add( sphere );

                // Cube
                // geometry = new THREE.SphereGeometry( 50, 32, 32 );
                geometry = new THREE.BoxGeometry( 100, 100, 100 );
                geometry.computeFaceNormals();
                textureCube = loader.load('img/paper-texture-2.png');
                textureCube.wrapS = textureCube.wrapT = THREE.RepeatWrapping;
                textureCube.repeat.set( 1, 1 );

                var shininess = 50, specular = 0x333333, bumpScale = 1, shading = THREE.SmoothShading;

var diffuseColor = new THREE.Color( .5, .5, .5 ).multiplyScalar( 0.2 );
material = new THREE.MeshPhongMaterial( { map: textureCube, bumpMap: textureCube, bumpScale: bumpScale, color: diffuseColor, specular: new THREE.Color( .8, .8, .8 ), reflectivity: 5, shininess: .01, shading: THREE.SmoothShading, envMap: loader.load('img/pz.jpg')  } )
                            // material = new THREE.MeshPhongMaterial( { map: textureCube, bumpMap: textureCube, bumpScale: bumpScale, color: diffuseColor, specular: new THREE.Color( .8, .8, .8 ), reflectivity: 100, shininess: 10, shading: THREE.SmoothShading, envMap: loader.load('img/clouds.png')  } )
                            // var mesh = new THREE.Mesh( geometry, material );

//                 new THREE.MeshPhongMaterial( {
//     color: 0x996633,
//     specular: 0x050505,
//     shininess: 100
// // } )

// //                 material = new THREE.MeshBasicMaterial( {
//                     // map: textureCube,
//                 } );
                cube = new THREE.Mesh( geometry, material );
                sceneFront.add( cube );
cube.castShadow = true;
                cube.receiveShadow = true;





                // Plane
                geometry = new THREE.PlaneGeometry(400, 400) ;

                geometry.computeFaceNormals();
                material = new THREE.MeshPhongMaterial( { color: 0xffdd99, side: THREE.DoubleSide, } );

                // material = new THREE.MeshBasicMaterial( {
                //     map: loader.load( 'img/paper-texture.png' ),
                //     side: THREE.DoubleSide,
                // } );
                plane = new THREE.Mesh( geometry, material ) ;
                plane.position.y = -50;
                plane.rotation.x = Math.PI/2;
                sceneFront.add( plane );
                // sceneBack.add( plane );
                plane.castShadow = false;
                plane.receiveShadow = true;





                renderer.gammaInput = true;
                renderer.gammaOutput = true;
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFShadowMap;

particleLight = new THREE.Mesh( new THREE.SphereBufferGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
                sceneFront.add( particleLight );
                // cameraPerspective.add( particleLight );



                particleLight.position.x = 0;
                particleLight.position.y = 0;
                particleLight.position.z = 0;


                sceneFront.add( new THREE.AmbientLight( 0x222222 ) );

                // var directionalLight = new THREE.DirectionalLight( 0xffff00, 1 );
                // directionalLight.position.set( 0, 100, 500 ).normalize();
                // sceneFront.add( directionalLight );
                // var pointLight = new THREE.PointLight( 0xffff00, 2, 2000 );
                // particleLight.add( pointLight );
//

                var light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
                light.position.set( 0, 1500, 1000 );
                light.target.position.set( 0, 0, 0 );
                light.castShadow = true;
                light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
                light.shadow.bias = 0.0001;
                // light.shadow.mapSize.width = 1024;
                // light.shadow.mapSize.height = 1024;
                particleLight.add( light );

                // var pointLight = new THREE.PointLight( 0xffff00, 200, 80000 );
                // particleLight.add( pointLight );






                var effectSave = new THREE.SavePass( new THREE.WebGLRenderTarget( width, height, rttParams ) );

                effectBlend = new THREE.ShaderPass( THREE.BlendShader, "tDiffuse1" );
                effectBlend.uniforms[ 'tDiffuse2' ].value = effectSave.renderTarget.texture;
                effectBlend.uniforms[ 'mixRatio' ].value = options.blending;

                var effectCopyFront = new THREE.ShaderPass( THREE.CopyShader );
                var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
                effectCopy.renderToScreen = true;

                effectHBlur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
                effectVBlur = new THREE.ShaderPass( THREE.VerticalBlurShader );
                effectHBlur.uniforms[ 'h' ].value = 2 / ( width / 2 ) * options.blurX;
                effectVBlur.uniforms[ 'v' ].value = 2 / ( height / 2 ) * options.blurY;

                var clearMask = new THREE.ClearMaskPass();
                var renderMaskBack = new THREE.MaskPass( sceneBack, cameraPerspective );
                var renderMaskInverseBack = new THREE.MaskPass( sceneBack, cameraPerspective );
                renderMaskInverseBack.inverse = true;
                var renderMaskFront = new THREE.MaskPass( sceneFront, cameraPerspective );
                var renderMaskInverseFront = new THREE.MaskPass( sceneFront, cameraPerspective );
                renderMaskInverseFront.inverse = true;

                var renderBack = new THREE.RenderPass( sceneBack, cameraPerspective );
                renderBack.clear = true;
                renderBack.alpha = true;
                renderBack.transparent = true;
                renderBack.premultipliedAlpha = true;

                var renderFront = new THREE.RenderPass( sceneFront, cameraPerspective );
                renderFront.clear = true;
                renderFront.alpha = true;
                renderFront.transparent = true;
                renderFront.premultipliedAlpha = true;

                composerBack = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget( width, height, rttParams ) );

                composerFront = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget( width, height, rttParams ) );

                composerMerge = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget( width, height, rttParams ) );
                composerMerge.autoClear = true;

                rttPassBack = new THREE.TexturePass( composerBack.renderTarget2.texture );
                rttPassFront = new THREE.TexturePass( composerFront.renderTarget2.texture );


                rttPassBack.uniforms.tDiffuse.value.format = THREE.RGBAFormat;
                rttPassFront.uniforms.tDiffuse.value.format = THREE.RGBAFormat;
                rttPassFront.material.transparent = true;

                composerBack.addPass( renderBack );

                composerFront.addPass( renderFront );
                composerFront.addPass( renderMaskInverseFront );
                composerFront.addPass( effectHBlur );
                composerFront.addPass( effectVBlur );
                composerFront.addPass( clearMask );

                composerMerge.addPass( rttPassBack );
                composerMerge.addPass( rttPassFront );
                composerMerge.addPass( effectBlend );
                composerMerge.addPass( effectSave );
                composerMerge.addPass( effectCopy);

                controls = new THREE.OrbitControls( cameraPerspective, renderer.domElement );
                // controls.addEventListener( 'change', render );
                // controls.maxPolarAngle = Math.PI / 2;
                controls.enableZoom = !false;
                controls.enablePan = false;

                window.addEventListener( 'resize', onWindowResize, false );
                window.addEventListener( 'mousedown', function(){ mousedown=true; }, false );
                window.addEventListener( 'mouseup', function(){ mousedown=false; }, false );

                onWindowResize();

            }

            function onWindowResize( event ) {
                cameraPerspective.aspect = window.innerWidth / window.innerHeight;
                cameraPerspective.updateProjectionMatrix();
                renderer.setSize( window.innerWidth, window.innerHeight );
                composerBack.setSize( width, height );
                composerFront.setSize( width, height );
                composerMerge.setSize( width, height );
                rttPassBack.uniforms[ "tDiffuse" ].value = composerBack.renderTarget2.texture;
                rttPassFront.uniforms[ "tDiffuse" ].value = composerFront.renderTarget2.texture;
            }

            function animate() {
                requestAnimationFrame( animate );
                stats.update();
                render();
            }

            function render() {
                var delta = clock.getDelta(),
                    time = clock.getElapsedTime() * 10;
                if ( options.animate ) {
                    cube.rotation.x += 1.2*delta * (1+Math.sin(time*.1))/2;
                    cube.rotation.y += 1.8*delta * (1+Math.sin(time*.1))/2;
                    cube.rotation.z += 2*delta * (1+Math.sin(time*.1))/2;
//                    cube.rotation.x += 1.2*delta;
//                    cube.rotation.y += 1.8*delta;
//                    cube.rotation.z += 2*delta;
//                    cube.scale.set(
//                        .3 + ( (Math.sin(time*.2)+1)/2 + (Math.sin(time*.052)+1)/2 ) * .5,
//                        .3 + ( (Math.sin(time*.3)+1)/2 + (Math.sin(time*.03)+1)/2 ) * .5,
//                        .3 + ( (Math.sin(time*.5)+1)/2 + (Math.sin(time*.045)+1)/2 ) * .5
//                    );
                }


                particleLight.position.x = Math.sin( time * .3 ) * 400;
                particleLight.position.y = Math.cos( time * .2 ) * 400;
                particleLight.position.z = Math.cos( time * .1 ) * 400;

                composerFront.render( delta );
                composerBack.render( delta );
                composerMerge.render( delta );
            }

        </script><div class="dg ac"><div class="dg main a" style="width: 245px;"><div style="width: 6px; margin-left: -3px; height: 112px; cursor: ew-resize; position: absolute;"></div><ul style="height: auto;"><li class="cr number has-slider"><div><span class="property-name">blending</span><div class="c"><div><input type="text"></div><div class="slider"><div class="slider-fg" style="width: 70.7071%;"></div></div></div></div></li><li class="cr number has-slider"><div><span class="property-name">blurX</span><div class="c"><div><input type="text"></div><div class="slider"><div class="slider-fg" style="width: 10%;"></div></div></div></div></li><li class="cr number has-slider"><div><span class="property-name">blurY</span><div class="c"><div><input type="text"></div><div class="slider"><div class="slider-fg" style="width: 10%;"></div></div></div></div></li><li class="cr boolean"><div><span class="property-name">animate</span><div class="c"><input type="checkbox"></div></div></li></ul><div class="close-button" style="width: 245px;">Close Controls</div></div></div>


</body>
