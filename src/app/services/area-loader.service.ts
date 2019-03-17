import { Injectable } from '@angular/core';
import {Mesh, Vector3} from 'three';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, mapTo} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {BlockService} from './block.service';


const POS_MASK = 1023; // 0b1111111111, 10 first bits

@Injectable({
  providedIn: 'root'
})
export class AreaLoaderService {

  /* tslint:disable: no-bitwise */
  static decodeIntToXYZ(encodedPos: number): Vector3 {
    const x = (encodedPos >> 20) & POS_MASK;
    const y = (encodedPos >> 10) & POS_MASK;
    const z = encodedPos & POS_MASK;
    return new Vector3(x, y, z);
  }

  constructor(private http: HttpClient, private blockService: BlockService) { }

  loadArea(areaId: number): Observable<Mesh[]> {
    const url = `http://${environment.rootUrl}/get`;
    return this.http.get(url).pipe(map((res) => this.generateBlocks(res) ));
  }

  generateBlocks(areaDict: any): Mesh[] {
    console.log(areaDict);
    const keys = Object.keys(areaDict);
    const positions = keys.map((key: string) => {
      const keyInt = parseInt(key, 10);
      console.log(keyInt);
      const pos = AreaLoaderService.decodeIntToXYZ(keyInt);
      console.log(pos);
      return this.blockService.buildBlock(pos, areaDict[keyInt]);
    });

    return positions;
  }

}
