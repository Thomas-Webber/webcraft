import { Injectable } from '@angular/core';
import {Vector3} from 'three';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, mapTo} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {forEach} from '@angular/router/src/utils/collection';

const POS_MASK = 2097151; // 0b111111111111111111111, 21 first bits

@Injectable({
  providedIn: 'root'
})
export class AreaLoaderService {

  /* tslint:disable: no-bitwise */
  static decodeIntToXYZ(encodedPos: number): Vector3 {
    const z = encodedPos & POS_MASK;
    const y = (encodedPos >> 21) & POS_MASK;
    const x = (encodedPos >> 42) & POS_MASK;
    return new Vector3(x, y, z);
  }

  constructor(private http: HttpClient) { }

  loadArea(areaId: number): Observable<Vector3[]> {
    const url = `http://${environment.rootUrl}/get`;
    return this.http.get(url).pipe(map((res) => this.generateBlocks(res) ));
  }

  generateBlocks(areaDict: any): Vector3[] {
    let positions = [];
    console.log(areaDict);
    // forEach(Object.keys(areaDict), (key: string) => {
    //   positions.push(AreaLoaderService.decodeIntToXYZ(areaDict[key]));
    // });

    return positions;
  }

}
