

			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var MARGIN = 100;
			var SCREEN_WIDTH = window.innerWidth;
			var SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;

			var SCALE = 0.75;

			var container, stats;

			var camera, scene, renderer;

			var clock = new THREE.Clock();

			var composer, effectScreen, effectColor, effectFXAA, effectSSAO, renderTargetParametersRGB, renderTargetParametersRGBA;

			var controlsCar = {

				moveForward: false,
				moveBackward: false,
				moveLeft: false,
				moveRight: false

			};

			var flareA, flareB;
			var sprites = [];

			var updateCubemap = true;

			var tiltShiftEnabled = true;

			var gyro;

			var n = 0;

			var morphs = [];
			var depthPassPlugin;

			init();
			animate();

			function init() {

				container = document.getElementById( 'container' );

				var FAR = 200;

				// camera

				camera = new THREE.PerspectiveCamera( 45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, FAR );
				camera.position.set( 5, 10, 30 );

				controls = new THREE.TrackballControls( camera );
				controls.dynamicDampingFactor = 0.2;

				// scene

				scene = new THREE.Scene();
				scene.add( camera );

				scene.fog = new THREE.Fog( 0x000000, 10, FAR );

				gyro = new THREE.Gyroscope();
				scene.add( gyro );

				// lights

				var ambient = new THREE.AmbientLight( 0xffffff );
				ambient.color.setHSV( 0, 0, 0.5 );
				scene.add( ambient );

				var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
				dirLight.position.set( 1, 0.25, 1 );
				scene.add( dirLight );

				var dirLight2 = new THREE.DirectionalLight( 0xffffff );
				dirLight2.position.set( 15, 15.5, 15 );

				dirLight2.castShadow = true;
				dirLight2.onlyShadow = true;
				//dirLight2.shadowCameraVisible = true;
				dirLight2.shadowCameraNear = 0.1;
				dirLight2.shadowCameraFar = 50;

				dirLight2.shadowDarkness = 0.25;
				dirLight2.shadowMapWidth = 2048;
				dirLight2.shadowMapHeight = 2048;

				var d = 15;
				dirLight2.shadowCameraLeft = -d * 2;
				dirLight2.shadowCameraRight = d * 2;
				dirLight2.shadowCameraTop = d;
				dirLight2.shadowCameraBottom = -d;

				gyro.add( dirLight2 );
				gyro.add( dirLight2.target );

				// world

				var materialGround1 = new THREE.MeshPhongMaterial( { color: 0xaaaaaa, ambient: 0xaaaaaa, specular: 0xaaaaaa, perPixel: true, vertexColors: THREE.FaceColors } );
				var materialGround = new THREE.MeshPhongMaterial( { color: 0xaaaaaa, ambient: 0xaaaaaa, specular: 0xaaaaaa, perPixel: true,  vertexColors: THREE.FaceColors } );

				materialGround.emissive.setHSV( 0, 0, 0.35 );
				materialGround1.emissive.setHSV( 0, 0, 0.35 );

				// ground

				var groundGeo = new THREE.PlaneGeometry( 12, 1000 );
				applyColor( groundGeo, 0, 0, 0.4 );

				var mesh = new THREE.Mesh( groundGeo, materialGround1 );
				mesh.rotation.x = -Math.PI/2;
				mesh.position.y = -2.5;

				mesh.receiveShadow = true;

				scene.add( mesh );

				// back

				var sideGeo = new THREE.CubeGeometry( 500, 0.5, 1000, 1, 1, 1 );
				removeBottom( sideGeo );

				var mesh = new THREE.Mesh( sideGeo, materialGround1 );
				mesh.position.y = -2.95 + 0.35;
				mesh.position.x = 250 + 9;
				mesh.receiveShadow = true;
				scene.add( mesh );

				var mesh = new THREE.Mesh( sideGeo, materialGround1 );
				mesh.position.y = -2.95 + 0.35;
				mesh.position.x = - ( 250 + 9 );
				mesh.receiveShadow = true;
				scene.add( mesh );

				// sidewalk

				var sideGeo = new THREE.CubeGeometry( 4, 1, 1000, 1, 1, 1 );
				removeBottom( sideGeo );
				applyColor( sideGeo, 0, 0, 0.65 );

				var mesh = new THREE.Mesh( sideGeo, materialGround1 );
				mesh.position.y = -2.95;
				mesh.position.x = 2 + 6;
				mesh.receiveShadow = true;
				scene.add( mesh );

				var mesh = new THREE.Mesh( sideGeo, materialGround1 );
				mesh.position.y = -2.95;
				mesh.position.x = - ( 2 + 6 );
				mesh.receiveShadow = true;
				scene.add( mesh );

				var curbGeo = new THREE.CubeGeometry( 0.25, 1.25, 1000, 1, 1, 1 );
				removeBottom( curbGeo );
				applyColor( curbGeo, 0, 0, 0.85 );

				var mesh = new THREE.Mesh( curbGeo, materialGround1 );
				mesh.position.y = -2.95;
				mesh.position.x = -6;
				mesh.receiveShadow = true;
				scene.add( mesh );

				var mesh = new THREE.Mesh( curbGeo, materialGround1 );
				mesh.position.y = -2.95;
				mesh.position.x = 6;
				mesh.receiveShadow = true;
				scene.add( mesh );

				var mergedGeo = new THREE.Geometry();

				// buildings

				var a = 1;
				var cubeGeo = new THREE.CubeGeometry( a, a, a, 1, 1, 1 );
				removeBottom( cubeGeo );

				for ( var i = 0; i < 10000; i ++ ) {

					var sy = 1 + 0.5 * Math.random();
					var sx = 1 + 1.5 * Math.random();
					var sz = 1.5 + 2.5 * Math.random();

					var mesh = new THREE.Mesh( cubeGeo, materialGround );

					mesh.position.x = ( Math.random() < 0.5 ? 1 : -1 ) * THREE.Math.randFloat( 11, 50 );
					sy *= 0.25 * Math.abs( mesh.position.x );

					mesh.position.y = 0.5 * ( sy * a );
					mesh.position.z = 200 * ( 2.0 * Math.random() - 1.0 );

					mesh.scale.set( sx, sy, sz );

					mesh.matrixAutoUpdate = false;
					mesh.updateMatrix();

					var h = 0.02;
					var v = 0.25 + 0.75 * Math.random();
					var s = Math.random() < 0.05 ? 1: 0;

					applyColor( cubeGeo, h, 0, v );

					THREE.GeometryUtils.merge( mergedGeo, mesh );

				}

				// lamps

				var b = 4;
				var c = 1;

				var cubeGeo2 = new THREE.CubeGeometry( 0.1, b, 0.1, 1, 1, 1 );
				var cubeGeo3 = new THREE.CubeGeometry( 0.15, c, 0.15, 1, 1, 1 );
				var cubeGeo4 = new THREE.CubeGeometry( 0.25, 0.25, 0.25, 1, 1, 1 );
				removeBottom( cubeGeo2 );
				removeBottom( cubeGeo3 );
				removeBottom( cubeGeo4 );

				function addPart( geo, x, y, z, h, s, v ) {

					var mesh = new THREE.Mesh( geo, materialGround );

					mesh.position.set( x, y, z );

					mesh.matrixAutoUpdate = false;
					mesh.updateMatrix();

					applyColor( geo, h, s, v );

					THREE.GeometryUtils.merge( mergedGeo, mesh );

				}

				var mesh = new THREE.Mesh( mergedGeo, materialGround );
				mesh.position.y = -2.95;
				scene.add( mesh );

				//

				var mergedGeo = new THREE.Geometry();

				var x, y, z, h, s, v;
				var xd = 6.5;

				var points = [];

				for ( var i = -50; i < 50; i ++ ) {

					//

					x = xd;
					y = b * 0.5;
					z = i * 10;

					h = 0.05;
					s = 0.1;
					v = 0.5;

					addPart( cubeGeo2, x, y, z, h, s, v );

					x = xd;
					y = c * 0.5;
					z = i * 10;

					h = 0;
					s = 0.35;
					v = 0.5;

					addPart( cubeGeo3, x, y, z, h, s, v );

					y = b;

					s = 0;
					v = 0.95;

					addPart( cubeGeo4, x, y, z, h, s, v );

					points.push( new THREE.Vector3( x+0.2, y, z+0.2 ) );
					points.push( new THREE.Vector3( x+0.2, y, z-0.2 ) );
					points.push( new THREE.Vector3( x-0.2, y, z-0.2 ) );
					points.push( new THREE.Vector3( x-0.2, y, z+0.2 ) );

					//

					x = -xd;
					y = b * 0.5;
					z = i * 10;

					h = 0.05 * Math.random();
					s = 0.1;
					v = 0.5;

					addPart( cubeGeo2, x, y, z, h, s, v );

					x = -xd;
					y = c * 0.5;
					z = i * 10;

					h = 0;
					s = 0.35;
					v = 0.5;

					addPart( cubeGeo3, x, y, z, h, s, v );

					y = b;

					s = 0;
					v = 0.95;

					addPart( cubeGeo4, x, y, z, h, s, v );

					points.push( new THREE.Vector3( x+0.2, y, z+0.2 ) );
					points.push( new THREE.Vector3( x+0.2, y, z-0.2 ) );
					points.push( new THREE.Vector3( x-0.2, y, z-0.2 ) );
					points.push( new THREE.Vector3( x-0.2, y, z+0.2 ) );

				}


				var mesh = new THREE.Mesh( mergedGeo, materialGround );
				mesh.position.y = -2.95;
				mesh.castShadow = true;
				scene.add( mesh );

				//

				var particleGeo = new THREE.Geometry();

				for ( var i = 0; i < points.length; i ++ ) {

					particleGeo.vertices[ i ] = points[ i ];

				}

				var map = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare0_alpha.png" );
				var particleMaterial = new THREE.ParticleBasicMaterial( { size: 2.5, color: 0xffffff, map: map, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false } );

				var particles = new THREE.ParticleSystem( particleGeo, particleMaterial );
				particles.position.y = -2.95;
				scene.add( particles );

				// CUBE CAMERA

				cubeCamera = new THREE.CubeCamera( 1, 100000, 128 );
				scene.add( cubeCamera );

				// MATERIALS

				var cubeTarget = cubeCamera.renderTarget;

				mlib = {

					body: [],

					"Chrome": 		new THREE.MeshLambertMaterial( { color: 0xffffff, ambient: 0xffffff, envMap: cubeTarget  } ),
					"ChromeN": 		new THREE.MeshLambertMaterial( { color: 0xffffff, ambient: 0xffffff, envMap: cubeTarget, combine: THREE.MixOperation, reflectivity: 0.75  } ),
					"Dark chrome": 	new THREE.MeshLambertMaterial( { color: 0x444444, ambient: 0x444444, envMap: cubeTarget } ),

					"Black rough1":	new THREE.MeshLambertMaterial( { color: 0x050505, ambient: 0x050505 } ),
					"Black rough":	new THREE.MeshLambertMaterial( { color: 0x111111, ambient: 0x111111 } ),

					"Dark glass":	new THREE.MeshLambertMaterial( { color: 0x101020, ambient: 0x101020, envMap: cubeTarget, opacity: 0.5, transparent: true } ),
					"Orange glass":	new THREE.MeshLambertMaterial( { color: 0xffbb00, ambient: 0xffbb00, opacity: 0.5, transparent: true } ),
					"Red glass": 	new THREE.MeshLambertMaterial( { color: 0xff0000, ambient: 0xff0000, opacity: 0.5, transparent: true } ),

					"Black metal":	new THREE.MeshPhongMaterial( { color: 0x111111, ambient: 0x000000, envMap: cubeTarget, combine: THREE.MixOperation, reflectivity: 0.05, perPixel: true } ),
					"Black metal1":	new THREE.MeshPhongMaterial( { color: 0xffffff, ambient: 0x444444, envMap: cubeTarget, combine: THREE.MixOperation, reflectivity: 0.05, perPixel: true } ),
					"Orange metal": new THREE.MeshLambertMaterial( { color: 0xff6600, ambient: 0xff6600, envMap: cubeTarget, combine: THREE.MixOperation } )

				}

				mlib.body.push( [ "Orange", new THREE.MeshLambertMaterial( { color: 0x883300, ambient: 0x883300, envMap: cubeTarget, combine: THREE.MixOperation, reflectivity: 0.1 } ) ] );
				mlib.body.push( [ "Blue", 	new THREE.MeshLambertMaterial( { color: 0x113355, ambient: 0x113355, envMap: cubeTarget, combine: THREE.MixOperation, reflectivity: 0.1 } ) ] );
				mlib.body.push( [ "Red", 	new THREE.MeshLambertMaterial( { color: 0x660000, ambient: 0x660000, envMap: cubeTarget, combine: THREE.MixOperation, reflectivity: 0.1 } ) ] );
				mlib.body.push( [ "Black", 	new THREE.MeshLambertMaterial( { color: 0x000000, ambient: 0x000000, envMap: cubeTarget, combine: THREE.MixOperation, reflectivity: 0.2 } ) ] );
				mlib.body.push( [ "White", 	new THREE.MeshPhongMaterial( { color: 0xff0000, ambient: 0xff0000, specular: 0xff0000, envMap: cubeTarget, combine: THREE.MixOperation, reflectivity: 0.29, perPixel: true } ) ] );

				mlib.body.push( [ "Carmine", new THREE.MeshPhongMaterial( { color: 0x770000, specular: 0xffaaaa, envMap: cubeTarget, combine: THREE.MultiplyOperation } ) ] );
				mlib.body.push( [ "Gold", 	 new THREE.MeshPhongMaterial( { color: 0xaa9944, specular: 0xbbaa99, shininess: 50, envMap: cubeTarget, combine: THREE.MultiplyOperation } ) ] );
				mlib.body.push( [ "Bronze",  new THREE.MeshPhongMaterial( { color: 0x150505, specular: 0xee6600, shininess: 10, envMap: cubeTarget, combine: THREE.MixOperation, reflectivity: 0.2 } ) ] );
				mlib.body.push( [ "Chrome",  new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, envMap: cubeTarget, combine: THREE.MultiplyOperation } ) ] );

				// FLARES

				flareA = THREE.ImageUtils.loadTexture( "textures/lensflare2_alpha.png" );
				flareB = THREE.ImageUtils.loadTexture( "textures/lensflare0_alpha.png" );

				// CARS - VEYRON

				veyron = new THREE.Car();

				veyron.modelScale = 0.025;
				veyron.backWheelOffset = 0.02;

				veyron.MAX_SPEED = 25;
				veyron.MAX_REVERSE_SPEED = -15;
				veyron.FRONT_ACCELERATION = 12;
				veyron.BACK_ACCELERATION = 15;

				veyron.WHEEL_ANGULAR_ACCELERATION = 1.5;

				veyron.FRONT_DECCELERATION = 10;
				veyron.WHEEL_ANGULAR_DECCELERATION = 1.0;

				veyron.STEERING_RADIUS_RATIO = 0.23;

				veyron.callback = function( object ) {

					addCar( object, 0, -2.495, 0, 0 );
					setMaterialsVeyron( object );

					var sa = 2, sb = 5;

					var params  = {

						"a" : { map: flareA, useScreenCoordinates: false, color: 0xffffff, blending: THREE.AdditiveBlending },
						"b" : { map: flareB, useScreenCoordinates: false, color: 0xffffff, blending: THREE.AdditiveBlending },

						"ar" : { map: flareA, useScreenCoordinates: false, color: 0xff0000, blending: THREE.AdditiveBlending },
						"br" : { map: flareB, useScreenCoordinates: false, color: 0xff0000, blending: THREE.AdditiveBlending }

					};

					var flares = [ // front
								   [ "a", sa, [ 47, 38, 120 ] ], [ "a", sa, [ 40, 38, 120 ] ], [ "a", sa, [ 32, 38, 122 ] ],
								   //[ "b", sb, [ 47, 38, 120 ] ], [ "b", sb, [ 40, 38, 120 ] ], [ "b", sb, [ 32, 38, 122 ] ],

								   [ "a", sa, [ -47, 38, 120 ] ], [ "a", sa, [ -40, 38, 120 ] ], [ "a", sa, [ -32, 38, 122 ] ],
								   //[ "b", sb, [ -47, 38, 120 ] ], [ "b", sb, [ -40, 38, 120 ] ], [ "b", sb, [ -32, 38, 122 ] ],

								   // back
								   [ "ar", sa, [ 22, 50, -123 ] ], [ "ar", sa, [ 32, 49, -123 ] ],
								   [ "br", sb, [ 22, 50, -123 ] ], [ "br", sb, [ 32, 49, -123 ] ],

								   [ "ar", sa, [ -22, 50, -123 ] ], [ "ar", sa, [ -32, 49, -123 ] ],
								   [ "br", sb, [ -22, 50, -123 ] ], [ "br", sb, [ -32, 49, -123 ] ],

								 ];

					for ( var i = 0; i < flares.length; i ++ ) {

						var p = params[ flares[ i ][ 0 ] ];

						var s = 0.005 * flares[ i ][ 1 ];

						var x = flares[ i ][ 2 ][ 0 ];
						var y = flares[ i ][ 2 ][ 1 ];
						var z = flares[ i ][ 2 ][ 2 ];

						var material = new THREE.SpriteMaterial( p );
						var sprite = new THREE.Sprite( material );

						var spriteWidth = 128;
						var spriteHeight = 128;

						sprite.scale.set( s * spriteWidth, s * spriteHeight, s );
						sprite.position.set( x, y, z );

						object.bodyMesh.add( sprite );

						sprites.push( sprite );

					}


				};

				veyron.loadPartsBinary( "obj/veyron/parts/veyron_body_bin2.js", "obj/veyron/parts/veyron_wheel_bin2.js" );

				// morphs

				var loader = new THREE.JSONLoader();

				loader.load( "rome/shdw3walk_lite.js", function( geometry ) {

					geometry.computeMorphNormals();
					morphColorsToFaceColors( geometry );

					for ( var i = 0; i < 30; i ++ ) {

						var x = ( Math.random() < 0.5 ? 1 : -1 ) * ( 7 + Math.random() * 1.5 );
						var z = -100 + Math.random() * 200;

						addMorph( geometry, 0.4, 2000, x, -1.82, z );

					}


				} );


				// renderer

				renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );
				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				renderer.setClearColor( scene.fog.color, 1 );

				renderer.domElement.style.position = "absolute";
				renderer.domElement.style.top = MARGIN + "px";
				renderer.domElement.style.left = "0px";

				container.appendChild( renderer.domElement );

				//

				renderer.gammaInput = true;
				renderer.gammaOutput = true;
				renderer.physicallyBasedShading = true;

				renderer.shadowMapEnabled = true;
				//renderer.shadowMapDebug = true;

				// stats

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				stats.domElement.style.zIndex = 100;
				container.appendChild( stats.domElement );

				stats.domElement.children[ 0 ].children[ 0 ].style.color = "#aaa";
				stats.domElement.children[ 0 ].style.background = "transparent";
				stats.domElement.children[ 0 ].children[ 1 ].style.display = "none";

				// composer

				renderer.autoClear = false;

				effectColor = new THREE.ShaderPass( THREE.ColorCorrectionShader );
				effectSSAO = new THREE.ShaderPass( THREE.SSAOShader );
				effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
				effectScreen = new THREE.ShaderPass( THREE.CopyShader );

				hblur = new THREE.ShaderPass( THREE.HorizontalTiltShiftShader );
				vblur = new THREE.ShaderPass( THREE.VerticalTiltShiftShader );

				var bluriness = 4;

				hblur.uniforms[ 'h' ].value = bluriness / ( SCALE * SCREEN_WIDTH );
				vblur.uniforms[ 'v' ].value = bluriness / ( SCALE * SCREEN_HEIGHT );

				hblur.uniforms[ 'r' ].value = vblur.uniforms[ 'r' ].value = 0.5;

				renderTargetParametersRGB  = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
				renderTargetParametersRGBA = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
				depthTarget = new THREE.WebGLRenderTarget( SCALE * SCREEN_WIDTH, SCALE * SCREEN_HEIGHT, renderTargetParametersRGBA );
				colorTarget = new THREE.WebGLRenderTarget( SCALE * SCREEN_WIDTH, SCALE * SCREEN_HEIGHT, renderTargetParametersRGBA );

				effectScreen.renderToScreen = true;
				vblur.renderToScreen = true;

				effectScreen.enabled = !tiltShiftEnabled;

				composer = new THREE.EffectComposer( renderer, colorTarget );
				composer.addPass( effectSSAO );
				composer.addPass( effectColor );
				composer.addPass( effectFXAA );
				composer.addPass( effectScreen );
				composer.addPass( hblur );
				composer.addPass( vblur );

				effectSSAO.uniforms[ 'tDepth' ].value = depthTarget;
				effectSSAO.uniforms[ 'size' ].value.set( SCALE * SCREEN_WIDTH, SCALE * SCREEN_HEIGHT );
				effectSSAO.uniforms[ 'cameraNear' ].value = camera.near;
				effectSSAO.uniforms[ 'cameraFar' ].value = camera.far;
				effectSSAO.uniforms[ 'fogNear' ].value = scene.fog.near;
				effectSSAO.uniforms[ 'fogFar' ].value = scene.fog.far;
				effectSSAO.uniforms[ 'fogEnabled' ].value = 1;
				effectSSAO.uniforms[ 'aoClamp' ].value = 0.5;

				effectSSAO.material.defines = { "RGBA_DEPTH": true, "ONLY_AO_COLOR": "1.0, 0.7, 0.5" };

				effectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( SCALE * SCREEN_WIDTH ), 1 / ( SCALE * SCREEN_HEIGHT ) );

				effectColor.uniforms[ 'mulRGB' ].value.set( 1.4, 1.4, 1.4 );
				effectColor.uniforms[ 'powRGB' ].value.set( 1.2, 1.2, 1.2 );

				// depth pass

				depthPassPlugin = new THREE.DepthPassPlugin();
				depthPassPlugin.renderTarget = depthTarget;

				renderer.addPrePlugin( depthPassPlugin );

				// events

				window.addEventListener( 'resize', onWindowResize, false );

				document.addEventListener( 'keydown', onKeyDown, false );
				document.addEventListener( 'keyup', onKeyUp, false );

			}

			//

			function addMorph( geometry, speed, duration, x, y, z, fudgeColor ) {

				var s = 0.01;

				var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 10, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading, perPixel: true } );
				material.wrapAround -= true;

				if ( 1 || fudgeColor ) {

					THREE.ColorUtils.adjustHSV( material.color, 0, 0.5 - Math.random(), 0.5 - Math.random() );
					material.ambient = material.color;

				}

				var meshAnim = new THREE.MorphAnimMesh( geometry, material );

				meshAnim.speed = speed;
				meshAnim.duration = duration;
				meshAnim.time = 600 * Math.random();

				meshAnim.position.set( x, y, z );

				meshAnim.scale.set( s, s, s );

				meshAnim.castShadow = true;
				meshAnim.receiveShadow = true;

				scene.add( meshAnim );

				morphs.push( meshAnim );

			}

			function morphColorsToFaceColors( geometry ) {

				if ( geometry.morphColors && geometry.morphColors.length ) {

					var colorMap = geometry.morphColors[ 0 ];

					for ( var i = 0; i < colorMap.colors.length; i ++ ) {

						geometry.faces[ i ].color = colorMap.colors[ i ];

					}

				}

			}

			//

			function setMaterialsVeyron( car ) {

				// 0 - top, front center, back sides
				// 1 - front sides
				// 2 - engine
				// 3 - small chrome things
				// 4 - backlights
				// 5 - back signals
				// 6 - bottom, interior
				// 7 - windshield

				// BODY

				var materials = car.bodyMaterials;

				materials[ 0 ] = mlib[ "Black metal" ];	// top, front center, back sides
				materials[ 1 ] = mlib[ "Chrome" ];			// front sides
				materials[ 2 ] = mlib[ "Chrome" ];			// engine
				materials[ 3 ] = mlib[ "Dark chrome" ];	// small chrome things
				materials[ 4 ] = mlib[ "Red glass" ];		// backlights
				materials[ 5 ] = mlib[ "Orange glass" ];	// back signals
				materials[ 6 ] = mlib[ "Black rough" ];	// bottom, interior
				materials[ 7 ] = mlib[ "Dark glass" ];		// windshield

				materials[ 1 ] = mlib.body[4][1];

				// WHEELS

				materials = car.wheelMaterials;

				materials[ 0 ] = mlib[ "Chrome" ];			// insides
				materials[ 1 ] = mlib[ "Black rough" ];	// tire

			}

			//

			function addCar( object, x, y, z, s ) {

				object.root.position.set( x, y, z );
				scene.add( object.root );

				object.enableShadows( true );

				object.root.add( gyro );
				gyro.add( camera );

			}

			function onKeyDown ( event ) {

				switch( event.keyCode ) {

					case 38: /*up*/	controlsCar.moveForward = true; break;
					case 87: /*W*/ 	controlsCar.moveForward = true; break;

					case 40: /*down*/controlsCar.moveBackward = true; break;
					case 83: /*S*/ 	 controlsCar.moveBackward = true; break;

					case 37: /*left*/controlsCar.moveLeft = true; break;
					case 65: /*A*/   controlsCar.moveLeft = true; break;

					case 39: /*right*/controlsCar.moveRight = true; break;
					case 68: /*D*/    controlsCar.moveRight = true; break;

					case 84: /*T*/   toggleTiltShift(); break;

					case 49: /*1*/	setFull(); break;
					case 50: /*2*/	setSSAO(); break;
					case 51: /*3*/	setNoSSAO(); break;

				}

			};

			function onKeyUp ( event ) {

				switch( event.keyCode ) {

					case 38: /*up*/controlsCar.moveForward = false; break;
					case 87: /*W*/ controlsCar.moveForward = false; break;

					case 40: /*down*/controlsCar.moveBackward = false; break;
					case 83: /*S*/ 	 controlsCar.moveBackward = false; break;

					case 37: /*left*/controlsCar.moveLeft = false; break;
					case 65: /*A*/ 	 controlsCar.moveLeft = false; break;

					case 39: /*right*/controlsCar.moveRight = false; break;
					case 68: /*D*/ 	  controlsCar.moveRight = false; break;

				}

			};

			//

			function setFull() {

				effectSSAO.uniforms.onlyAO.value = 0;
				effectSSAO.enabled = true;
				effectColor.enabled = true;

			};

			function setSSAO() {

				effectSSAO.uniforms.onlyAO.value = 1;
				effectSSAO.enabled = true;
				effectColor.enabled = false;

			};

			function setNoSSAO() {

				effectSSAO.enabled = false;
				effectColor.enabled = true;

			};

			//

			function toggleTiltShift() {

				if ( tiltShiftEnabled ) {

					tiltShiftEnabled = false;

					hblur.enabled = false;
					vblur.enabled = false;

					effectScreen.enabled = true;

				} else {

					tiltShiftEnabled = true;

					hblur.enabled = true;
					vblur.enabled = true;

					effectScreen.enabled = false;

				}

			};

			//

			function removeBottom( geo ) {

				var newFaces = [];

				for ( var j = 0, jl = geo.faces.length; j < jl; j ++ ) {

					if ( geo.faces[ j ].materialIndex !== 3 ) newFaces.push( geo.faces[ j ] );

				}

				geo.faces = newFaces;

				console.log( geo );
				console.log( newFaces );

			}

			//

			function applyColor( geo, h, s, v ) {

				for ( var j = 0, jl = geo.faces.length; j < jl; j ++ ) {

					geo.faces[ j ].color.setHSV( h, s, v );

				}

			}

			//

			function onWindowResize( event ) {

				SCREEN_WIDTH = window.innerWidth;
				SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;

				camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
				camera.updateProjectionMatrix();

				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

				depthTarget = new THREE.WebGLRenderTarget( SCALE * SCREEN_WIDTH, SCALE * SCREEN_HEIGHT, renderTargetParametersRGBA );
				colorTarget = new THREE.WebGLRenderTarget( SCALE * SCREEN_WIDTH, SCALE * SCREEN_HEIGHT, renderTargetParametersRGBA );

				composer.reset( colorTarget );

				effectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( SCALE * SCREEN_WIDTH ), 1 / ( SCALE * SCREEN_HEIGHT ) );
				effectSSAO.uniforms[ 'size' ].value.set( SCALE * SCREEN_WIDTH, SCALE * SCREEN_HEIGHT );

				depthPassPlugin.renderTarget = depthTarget;
				effectSSAO.uniforms[ 'tDepth' ].value = depthTarget;

			}

			function enableObjects( objects, enabled ) {

				for ( var i = 0; i < objects.length; i ++ ) {

					objects[ i ].visible = enabled;

				}

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				var delta = clock.getDelta();

				// update camera controls

				controls.update( delta );

				// update morphs

				for ( var i = 0; i < morphs.length; i ++ ) {

					morph = morphs[ i ];

					morph.updateAnimation( 1000 * delta );

					morph.position.z += morph.speed * delta;

					if ( morph.position.z  > 400 )  {

						morph.position.z = -400 - Math.random() * 50;

					}

				}

				// update car model

				veyron.updateCarModel( delta, controlsCar );

				// update cube map

				if ( updateCubemap ) {

					veyron.setVisible( false );

					cubeCamera.position.copy( veyron.root.position );

					renderer.autoUpdateObjects = false;
					renderer.initWebGLObjects( scene );

					renderer.autoClear = true;
					cubeCamera.updateCubeMap( renderer, scene );

					veyron.setVisible( true );

					updateCubemap = false;

				}

				if ( n % 5 == 0 ) updateCubemap = true;

				n ++;

				// render color and depth maps

				renderer.autoClear = false;
				renderer.autoUpdateObjects = true;
				renderer.shadowMapEnabled = true;
				depthPassPlugin.enabled = true;

				renderer.render( scene, camera, composer.renderTarget2, true );

				renderer.shadowMapEnabled = false;
				depthPassPlugin.enabled = false;

				// do postprocessing

				composer.render( 0.1 );

			}
