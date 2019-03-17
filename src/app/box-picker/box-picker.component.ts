import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

const COLORS = [
  0x9400D3,
  0x4B0082,
  0x0000FF,
  0x00FF00,
  0xFFFF00,
  0xFF7F00,
  0xFF0000,
];

@Component({
  selector: 'app-box-picker',
  templateUrl: './box-picker.component.html',
  styleUrls: ['./box-picker.component.sass']
})
export class BoxPickerComponent implements OnInit {
  colors = COLORS;
  colorSelected;

  @Input()
  get color(): number {
    return this.colorSelected;
  }
  set color(val: number) {
    this.colorSelected = val;
    this.colorChange.emit(this.colorSelected);
  }

  @Output() colorChange = new EventEmitter();

  ngOnInit() {
  }

  selectColor(color) {
    this.color = color;
  }

}
