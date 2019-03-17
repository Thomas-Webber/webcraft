import { Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {PointerLockHelper, PointerLockObserver} from '../helpers/PointerLockHelper';
import PointerLockControls from '../control/PointerLockControls';
import {AreaLoaderService} from './services/area-loader.service';
import {BlockService} from './services/block.service';
import {Mesh, Vector3} from 'three';

let camera, scene, renderer;
let controls, time = Date.now();
let ray;
let world = [];
const BOX_SIZE = 10;
const BOX_COLOR = 0xffffff;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, PointerLockObserver {
  locked = true;
  pointerLockHelper: PointerLockHelper;
  color = 0x00FF00;

  constructor(private blockService: BlockService, private areaLoader: AreaLoaderService) {}

  ngOnInit() {
    this.initTHREE();
    this.animate();
  }

  notifyPointerlockchange(isLocked: boolean): void {
    this.locked = isLocked;

    if (controls) {
      controls.enabled = !isLocked;
    }
  }

  onBlockerClick() {
    this.pointerLockHelper.onBlockerClick();
  }

  onColorChange() {
    if (this.pointerLockHelper) {
      this.pointerLockHelper.onBlockerClick();
    }
  }

  initTHREE() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    scene = new THREE.Scene();
    controls = new PointerLockControls(camera);
    this.pointerLockHelper = new PointerLockHelper(this);
    this.pointerLockHelper.init();
    scene.add(controls.getObject());
    ray = new THREE.Raycaster(controls.getObject().position, new THREE.Vector3(0, -1, 0));

    // GRID
    const gridHelper = new THREE.GridHelper(1000, 100);
    scene.add(gridHelper);

    // INIT AREA
    this.areaLoader.loadArea(0).subscribe((meshes) => {
      meshes.forEach((mesh: Mesh) => {
        scene.add(mesh);
        world.push(mesh);
      });
    });

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0x606060, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 2.5;
    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.background = new THREE.Color('black');
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
  }

  onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    controls.update(Date.now() - time);
    renderer.render(scene, camera);
    time = Date.now();
  }

  onDocumentMouseDown() {
    if (!controls.enabled) {
      return;
    }

    const intersects = controls.raycaster.intersectObjects(world);
    const firstIntersectedObject = intersects.length ? intersects[0].object : null;
    if (firstIntersectedObject) {
      const cube = this.blockService.buildBlock(firstIntersectedObject.position, this.color);
      const translation = intersects[0].face.normal.clone().multiplyScalar(BOX_SIZE);
      cube.position.add(translation);
      scene.add(cube);
      world.push(cube);
    }
  }
}

