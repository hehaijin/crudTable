import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.less']
})
export class CrudTableComponent implements OnInit {

  @Input() dataSource;
  @Input() displayedColumns;

  constructor() { }

  ngOnInit() {
  }

}
