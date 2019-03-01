// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

export class PointerLockHelper {
  controls = null;
  blocker = null;
  instructions = null;
  reticle = null;

  constructor(controls) {
    this.controls = controls;
  }

  initialize() {
    this.blocker = document.getElementById('blocker');
    this.instructions = document.getElementById('instructions');
    this.reticle = document.getElementById('reticle');
    const element = document.body;

    const havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document ||
      'webkitPointerLockElement' in document;
    if (havePointerLock) {
      const pointerlockchange = (event) => {
        if ((document as any).pointerLockElement === element || (document as any).mozPointerLockElement === element ||
          (document as any).webkitPointerLockElement === element) {
          if (this.controls) {
            this.controls.enabled = true;
          }
          this.blocker.style.display = 'none';
          this.reticle.style.display = 'inline';
        } else {
          if (this.controls) {
            this.controls.enabled = false;
          }
          this.reticle.style.display = 'none';
          this.blocker.style.display = '-webkit-box';
          this.blocker.style.display = '-moz-box';
          this.blocker.style.display = 'box';
          this.instructions.style.display = '';
        }
      };

      const pointerlockerror = function () {
        this.instructions.style.display = '';
      };

      // Hook pointer lock state change events
      document.addEventListener('pointerlockchange', pointerlockchange.bind(this), false);
      document.addEventListener('mozpointerlockchange', pointerlockchange.bind(this), false);
      document.addEventListener('webkitpointerlockchange', pointerlockchange.bind(this), false);
      document.addEventListener('pointerlockerror', pointerlockerror, false);
      document.addEventListener('mozpointerlockerror', pointerlockerror, false);
      document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
      this.instructions.addEventListener('click', () => {
        this.instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        (element as any).requestPointerLock = (element as any).requestPointerLock ||
          (element as any).mozRequestPointerLock || (element as any).webkitRequestPointerLock;
        if (/Firefox/i.test(navigator.userAgent)) {
          const fullscreenchange = function () {
            if ((document as any).fullscreenElement === element || (document as any).mozFullscreenElement === element ||
              (document as any).mozFullScreenElement === element) {
              document.removeEventListener('fullscreenchange', fullscreenchange);
              document.removeEventListener('mozfullscreenchange', fullscreenchange);
              (element as any).requestPointerLock();
            }
          };
          document.addEventListener('fullscreenchange', fullscreenchange, false);
          document.addEventListener('mozfullscreenchange', fullscreenchange, false);
          (element as any).requestFullscreen = (element as any).requestFullscreen ||
            (element as any).mozRequestFullscreen || (element as any).mozRequestFullScreen ||
            (element as any).webkitRequestFullscreen;
          element.requestFullscreen();
        } else {
          (element as any).requestPointerLock();
        }

      }, false);
    } else {
      this.instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }
  }

}


