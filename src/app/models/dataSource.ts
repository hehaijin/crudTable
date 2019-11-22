import { Observable } from 'rxjs';

export interface DataSource {
    dataview: Observable<{ data: any[], length: number }>
    //   length: Observable<any>
    query(state): any;
}



export class LocalDataSource implements DataSource {

    dataview: Observable<{ data: any[], length: number }>;
    sort
    filter
    paging
    constructor(public originalData: any[]) {

    }

    query(state) {
        const data = this.processData(this.originalData, state);
        return {
            data: data,
            length: this.originalData.length
        }
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

    processData(data, pageState) {
        // this.dataView = this.dataSource.slice(ev.pageIndex * ev.pageSize, ev.pageIndex * ev.pageSize + ev.pageSize);
        const d1 = this.applyFilter(data, pageState.filter);
        const d2 = this.applySort(d1, pageState.sort);
        const d3 = this.applyPaging(d2, pageState.paging);
        return d3;
    }

    applyFilter(data, filter) {
        return { data: data, length: data.length };
    }

    applySort(data, sort, customSort?) {
        if (!sort.active || sort.direction === '') {
            return data;
        }
        const result = data.sort((a, b) => this.compare(a[sort.active], b[sort.active], sort.direction === 'asc')).slice();
        return result;
    }

    applyPaging(data, paging) {
        return data.slice(paging.pageIndex * paging.pageSize, paging.pageIndex * paging.pageSize + paging.pageSize);
    }


}


