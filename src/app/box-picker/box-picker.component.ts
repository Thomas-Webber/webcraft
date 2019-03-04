import { Component, OnInit } from '@angular/core';

const COLORS = [
  '#9400D3',
  '#4B0082',
  '#0000FF',
  '#00FF00',
  '#FFFF00',
  '#FF7F00',
  '#FF0000',
];

@Component({
  selector: 'app-box-picker',
  templateUrl: './box-picker.component.html',
  styleUrls: ['./box-picker.component.sass']
})
export class BoxPickerComponent implements OnInit {
  colors = COLORS;
  color = '';

  constructor() { }

  ngOnInit() {
  }

  selectColor(color) {
    this.color = color;
  }

}
