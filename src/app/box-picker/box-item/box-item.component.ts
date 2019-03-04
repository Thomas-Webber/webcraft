import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-box-item',
  templateUrl: './box-item.component.html',
  styleUrls: ['./box-item.component.sass']
})
export class BoxItemComponent implements OnInit {
  @Input() color = '#fff';

  constructor() { }

  ngOnInit() {
  }

}
