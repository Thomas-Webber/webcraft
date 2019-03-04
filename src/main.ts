import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

import * as THREE from 'three';
import PointerLockControls from './control/PointerLockControls';
import PointerLockHelper from './helpers/PointerLockHelper';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

let camera, scene, renderer;
let controls, time = Date.now();
let ray;
let world = [];
const BOX_SIZE = 10;
const BOX_COLOR = 0xffffff;
const BOX_GEOMETRY = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  scene = new THREE.Scene();
  controls = new PointerLockControls(camera);
  const pointerLockHelper = new PointerLockHelper(controls);
  pointerLockHelper.initialize();
  scene.add(controls.getObject());
  ray = new THREE.Raycaster(controls.getObject().position, new THREE.Vector3(0, -1, 0));

  // GRID
  const gridHelper = new THREE.GridHelper(1000, 100);
  scene.add(gridHelper);

  // FLOOR
  const FLOOR_LENGTH = 2;
  for (let x = -FLOOR_LENGTH; x <= FLOOR_LENGTH; x++) {
    for (let z = -FLOOR_LENGTH; z <= FLOOR_LENGTH; z++) {
      const mat = getMaterial(BOX_COLOR - Math.abs(x) * Math.abs(z) * 180);
      const cube = new THREE.Mesh(BOX_GEOMETRY, mat);
      scene.add(cube);
      world.push(cube);
      cube.position.set(x * 10 + BOX_SIZE / 2, BOX_SIZE / 2, z * 10 + BOX_SIZE / 2);
    }
  }

  // LIGHTS
  const ambientLight = new THREE.AmbientLight(0x606060, 0.7);
  scene.add( ambientLight );

  const directionalLight = new THREE.DirectionalLight( 0xffffff);
  directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.near = 2.5;
  scene.add( directionalLight );

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene.background = new THREE.Color('black');
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update(Date.now() - time);
  renderer.render(scene, camera);
  time = Date.now();
}

function onDocumentMouseDown() {
  if (!controls.enabled) {
    return;
  }

  const intersects = controls.raycaster.intersectObjects(world);
  const firstIntersectedObject = intersects.length ? intersects[0].object : null;
  if (firstIntersectedObject) {
    const position = firstIntersectedObject.position;
    const mat = getMaterial(0x00ff00);
    const cube = new THREE.Mesh(BOX_GEOMETRY, mat);
    cube.position.set(position.x, position.y, position.z);

    const translation = intersects[0].face.normal.clone().multiplyScalar(BOX_SIZE);
    cube.position.add(translation);
    scene.add(cube);
    world.push(cube);
  }
}

function getMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color: color,
    roughness: 1,
    metalness: 0,
    flatShading: true
  });
}
