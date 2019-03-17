import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-box-item',
  templateUrl: './box-item.component.html',
  styleUrls: ['./box-item.component.sass']
})
export class BoxItemComponent implements OnInit {
  @Input() color = 0xfff;

  constructor() { }

  ngOnInit() {
  }

  /* tslint:disable: no-bitwise */
  formatHex(color: number) {
    return '#' + ('00000' + (color | 0).toString(16)).substr(-6);
  }

}
