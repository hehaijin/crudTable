import { Component, OnInit, Input, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';



@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.less']
})
export class CrudTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() dataSource;
  @Input() displayedColumns;
  finalDataView;
  editRows = new BehaviorSubject<any[]>([{ position: 0 }]);
  dataView = new BehaviorSubject<any[]>([]);

  editingIndex = -1;

  initialPageState = {
    paging: {
      pageIndex: 0,
      pageSize: 5
    },
    sort: {
      active: undefined,
      direction: ''
    },
    filter: undefined
  }
  pageState = new BehaviorSubject<any>(this.initialPageState);

  viewsub;

  constructor() {

  }

  ngOnInit() {
    this.viewsub = this.pageState.subscribe(ps => {
      this.editingIndex = -1; //reset editing index;
      this.dataView.next(this.processData(this.dataSource, ps));
    })
    this.finalDataView = combineLatest(this.editRows, this.dataView).pipe(
      map(([edits, dataview]) => edits.concat(dataview))
    );
  }


  ngOnChanges() {
    this.pageState.next(this.initialPageState);
    this.editRows.next([{ position: 0 }]);
    this.dataView.next(this.processData(this.dataSource, this.pageState.value));
  }


  processData(data, pageState) {
    // this.dataView = this.dataSource.slice(ev.pageIndex * ev.pageSize, ev.pageIndex * ev.pageSize + ev.pageSize);
    const d1 = this.applyFilter(data, pageState.filter);
    const d2 = this.applySort(d1, pageState.sort);
    const d3 = this.applyPaging(d2, pageState.paging);
    return d3;
  }

  applyFilter(data, filter) {
    return data;
  }

  applySort(data, sort) {
    if (!sort.active || sort.direction === '') {
      return data;
    }
    const result = data.sort((a, b) => this.compare(a[sort.active], b[sort.active], sort.direction === 'asc')).slice();
    return result;
  }

  applyPaging(data, paging) {
    return data.slice(paging.pageIndex * paging.pageSize, paging.pageIndex * paging.pageSize + paging.pageSize);
  }


  handleSort(sort: Sort) {
    const state = this.pageState.value;
    state.sort = sort;
    this.pageState.next(state);
  }

  handlePageChange(ev) {
    const state = this.pageState.value;
    state.paging = ev;
    this.pageState.next(state);
  }

  compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
    let r = 0;
    if (typeof a === 'number' && typeof b === 'number') {
      r = (a < b ? -1 : 1);
    } else if (typeof a === 'string' && typeof b === 'string') {
      r = a.localeCompare(b)
    } else if (typeof a === 'boolean' && typeof b === 'boolean') {
      r = (a === true ? 1 : -1) - (b === true ? 1 : -1);
    }
    return r * (isAsc ? 1 : -1);
  }

  handleEditClick(ev, index, element) {
    this.editingIndex = index;
  }

  handleCancel(ev, i) {
    this.editingIndex = -1;
  }

  handleSave(i) {
    
  }

  ngOnDestroy() {
    this.viewsub.unsubscribe();
  }

}
