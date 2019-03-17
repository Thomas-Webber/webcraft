import { Injectable } from '@angular/core';
import {MeshStandardMaterial, BoxGeometry, Vector3, Mesh} from 'three';

const BOX_SIZE = 10;
const BOX = {
  SIZE: BOX_SIZE,
  COLOR: 0xffffff,
  GEOMETRY: new BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE)
};

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor() { }

  buildBlock(position: Vector3, color: number = null): Mesh {
    const cube = new Mesh(BOX.GEOMETRY, this.getMaterial(color));
    cube.position.set(position.x, position.y, position.z);
    return cube;
  }

  getMaterial(color: number = null) {
    return new MeshStandardMaterial({
      color: color,
      roughness: 1,
      metalness: 0,
      flatShading: true
    });
  }
}
