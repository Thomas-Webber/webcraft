import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Mesh, Vector3} from 'three';
import { Subject } from 'rxjs';
import {BlockService} from './block.service';

interface BlockMessage {
  PosX: number;
  PosY: number;
  PosZ: number;
  Color: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket;
  readonly _messageSubject: Subject<Mesh>;

  constructor(private blockService: BlockService) {
    this._messageSubject = new Subject<Mesh>();
    this.socket = new WebSocket(`${environment.rootUrlWs}/ws`);
    this.socket.onmessage = this.onMessage.bind(this);
  }

  sendBuildBlockMessage(position: Vector3, color: number) {
    const msg: BlockMessage = {
      PosX: position.x,
      PosY: position.y,
      PosZ: position.z,
      Color: color,
    };

    this.socket.send(JSON.stringify(msg));
  }

  get messageSubject(): Subject<Mesh> {
    return this._messageSubject;
  }

  private onMessage(message) {
    const msg: BlockMessage = JSON.parse(message.data);
    const mesh = this.blockService.buildBlock(new Vector3(msg.PosX, msg.PosY, msg.PosZ), msg.Color);
    this._messageSubject.next(mesh);
  }
}
