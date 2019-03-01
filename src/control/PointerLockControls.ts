import * as THREE from 'three';

let PointerLockControls = function (camera) {
  let scope = this;

  let pitchObject = new THREE.Object3D();
  pitchObject.add(camera);

  let yawObject = new THREE.Object3D();
  yawObject.position.y = 20;
  yawObject.add(pitchObject);

  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let moveUp = false;
  let moveDown = false;
  let shiftDown = false;

  let isOnObject = false;
  let canJump = false;

  let velocity = new THREE.Vector3();
  this.mouse = new THREE.Vector2(0, 0);
  this.raycaster = new THREE.Raycaster();

  const PI_2 = Math.PI / 2;

  const onMouseMove = function (event) {
    if (scope.enabled === false) {
      return;
    }
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;
    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
  };

  const onKeyDown = function (event) {
    switch (event.keyCode) {
      case 16: //shift
        shiftDown = true;
        break;

      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 32: // space
        if (shiftDown) {
          moveDown = true;
        } else {
          moveUp = true;
        }
        break;
    }

  };

  let onKeyUp = function (event) {
    switch (event.keyCode) {
      case 16: //shift
        shiftDown = false;
        break;

      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // a
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

      case 32: // space
        moveDown = false;
        moveUp = false;
        break;
    }

  };

  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);

  this.enabled = false;

  this.getObject = function () {
    return yawObject;
  };

  this.update = function (delta) {
    if (scope.enabled === false) {
      return;
    }

    delta *= 0.1;

    velocity.x += (-velocity.x) * 0.08 * delta;
    velocity.z += (-velocity.z) * 0.08 * delta;
    velocity.y += (-velocity.y) * 0.08 * delta;

    if (moveForward) {
      velocity.z -= 0.12 * delta;
    }
    if (moveBackward) {
      velocity.z += 0.12 * delta;
    }
    if (moveLeft) {
      velocity.x -= 0.12 * delta;
    }
    if (moveRight) {
      velocity.x += 0.12 * delta;
    }
    if (moveUp) {
      velocity.y += 0.12 * delta;
    }
    if (moveDown) {
      velocity.y -= 0.12 * delta;
    }

    yawObject.translateX(velocity.x);
    yawObject.translateY(velocity.y);
    yawObject.translateZ(velocity.z);

    scope.raycaster.setFromCamera(scope.mouse, camera);
  };

};

export default PointerLockControls;
