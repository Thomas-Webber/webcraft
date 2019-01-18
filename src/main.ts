import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as THREE from 'three';
import PointerLockControls from './control/PointerLockControls';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


var camera, scene, renderer;
var geometry, material, mesh;
var controls,time = Date.now();
var objects = [];
var ray;
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if ( havePointerLock ) {
	var element = document.body;
	const pointerlockchange = function ( event ) {
		if ( (document as any).pointerLockElement === element || (document as any).mozPointerLockElement === element || (document as any).webkitPointerLockElement === element ) {
			controls.enabled = true;
			blocker.style.display = 'none';
		} else {
			controls.enabled = false;
			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';
			instructions.style.display = '';
		}
	};

	const pointerlockerror = function (  ) {
		instructions.style.display = '';
	};

	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
	instructions.addEventListener( 'click', function ( event ) {
		instructions.style.display = 'none';
		// Ask the browser to lock the pointer
		(element as any).requestPointerLock = (element as any).requestPointerLock || (element as any).mozRequestPointerLock || (element as any).webkitRequestPointerLock;
		if ( /Firefox/i.test( navigator.userAgent ) ) {
			var fullscreenchange = function ( event ) {
				if ( (document as any).fullscreenElement === element || (document as any).mozFullscreenElement === element || (document as any).mozFullScreenElement === element ) {
					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
					(element as any).requestPointerLock();
				}
			}
			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
			(element as any).requestFullscreen = (element as any).requestFullscreen || (element as any).mozRequestFullscreen || (element as any).mozRequestFullScreen || (element as any).webkitRequestFullscreen;
			element.requestFullscreen();
		} else {
			(element as any).requestPointerLock();
		}
	}, false );
} else {
	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    scene = new THREE.Scene();
    console.log(scene);
    controls = new PointerLockControls(camera);
    // scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
    // var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
    // light.position.set( 1, 1, 1 );
    // scene.add( light );
    // var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
    // light.position.set( -1, - 0.5, -1 );
    // scene.add( light );

    scene.add(controls.getObject());
    ray = new THREE.Raycaster(controls.getObject().position, new THREE.Vector3(0, -1, 0));

    // Object:Plane
    let PlaneGeometry1 = new THREE.PlaneGeometry(100, 100);
    let PlaneMaterial1 = new THREE.MeshPhongMaterial({ color: 'white', wireframe: false });
    const Plane1 = new THREE.Mesh(PlaneGeometry1, PlaneMaterial1);

    Plane1.rotation.x -= Math.PI / 2;
    Plane1.receiveShadow = true;
    objects.push(Plane1);
    scene.add(Plane1);

    // Object:Light:1
    const light1 = new THREE.PointLight('white', .8);
    light1.position.set(10, 3, 0);
    light1.castShadow = true;
    light1.shadow.camera.near = 2.5;
    scene.add(light1);

    const light2 = new THREE.AmbientLight('white', .35);
    light2.position.set(30, 3, 0);
    scene.add(light2);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.background = new THREE.Color('black');
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame(animate);
	// ray.ray.origin.copy(controls.getObject().position);
	// ray.ray.origin.y -= 10;
	// const intersections = ray.intersectObjects(objects);
	// if (intersections.length > 0) {
	// 	const distance = intersections[0].distance;
	// 	if (distance > 0 && distance < 10) {
     //  controls.isOnObject(true);
    // }
    //
	// }
	controls.update(Date.now() - time);
	renderer.render( scene, camera );
	time = Date.now();
}
