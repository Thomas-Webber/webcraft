export interface PointerLockObserver {
  notifyPointerlockchange(isLocked: boolean): void;
}

export class PointerLockHelper {
  observer: PointerLockObserver;

  constructor(observer: PointerLockObserver) {
    this.observer = observer;
  }

  hasPointerLock(): boolean {
    return ('pointerLockElement' in document || 'mozPointerLockElement' in document ||
      'webkitPointerLockElement' in document);
  }

  init() {
    const element = document.body;

    if (this.hasPointerLock()) {
      const pointerlockchange = () => {
        if ((document as any).pointerLockElement === element || (document as any).mozPointerLockElement === element ||
          (document as any).webkitPointerLockElement === element) {
          this.observer.notifyPointerlockchange(false);
        } else {
          this.observer.notifyPointerlockchange(true);
        }
      };

      // const pointerlockerror = function () {
        // console.error('pointerlockerror', event);
      // };

      // Hook pointer lock state change events
      document.addEventListener('pointerlockchange', pointerlockchange.bind(this), false);
      document.addEventListener('mozpointerlockchange', pointerlockchange.bind(this), false);
      document.addEventListener('webkitpointerlockchange', pointerlockchange.bind(this), false);
      // document.addEventListener('pointerlockerror', pointerlockerror, false);
      // document.addEventListener('mozpointerlockerror', pointerlockerror, false);
      // document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
    } else {
      console.error('Your browser doesn\'t seem to support Pointer Lock API');
    }
  }

  onBlockerClick() {
    const element = document.body;

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
  }

}


