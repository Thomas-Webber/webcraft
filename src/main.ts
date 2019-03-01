import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

import * as THREE from 'three';
import PointerLockControls from './control/PointerLockControls';
import {PointerLockHelper}from './helpers/PointerLockHelper';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

let camera, scene, renderer;
let geometry, material, mesh;
let controls, time = Date.now();
let objects = [];
let ray;
let world = [];
let lastIntersected = { object: null, initialColor: 0xffffff };
const INTERSECTED_COLOR = 0xff0000;
const BOX_SIZE = 10;


init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  scene = new THREE.Scene();
  console.log(scene);
  controls = new PointerLockControls(camera);
  const pointerLockHelper = new PointerLockHelper(controls);
  pointerLockHelper.initialize();
  // scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  scene.add(controls.getObject());
  ray = new THREE.Raycaster(controls.getObject().position, new THREE.Vector3(0, -1, 0));

  // GRID
  const gridHelper = new THREE.GridHelper(1000, 100);
  scene.add(gridHelper);

  // Object:Plane
  let PlaneGeometry1 = new THREE.PlaneGeometry(100, 100);
  let PlaneMaterial1 = new THREE.MeshPhongMaterial({color: 'white', wireframe: false});
  const Plane1 = new THREE.Mesh(PlaneGeometry1, PlaneMaterial1);
  Plane1.rotation.x -= Math.PI / 2;
  Plane1.receiveShadow = true;
  objects.push(Plane1);
  scene.add(Plane1);
  world.push(Plane1);

  // LIGHTS
  const ambientLight = new THREE.AmbientLight(0x606060, 0.7);
  scene.add( ambientLight );

  const directionalLight = new THREE.DirectionalLight( 0xffffff);
  directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.near = 2.5;
  scene.add( directionalLight );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene.background = new THREE.Color('black');
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update(Date.now() - time);

  // update the picking ray with the camera and mouse position
  const intersects = controls.raycaster.intersectObjects(world);
  const firstIntersectedObject = intersects.length ? intersects[0].object : null;
  if (lastIntersected.object) {
    lastIntersected.object.material.color.set(lastIntersected.initialColor);
  }
  lastIntersected.object = firstIntersectedObject;
  if (firstIntersectedObject) {
    lastIntersected.initialColor = firstIntersectedObject.material.color.getHex();
    firstIntersectedObject.material.color.set(INTERSECTED_COLOR);
  }

  renderer.render(scene, camera);
  time = Date.now();
}
