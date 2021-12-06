import {HttpParams} from '@angular/common/http';

export class Pageable {
    page: number;
    size: number;
    sort: Sort[];


    constructor(page: number, size: number, sort?: Sort[]) {
        this.page = page;
        this.size = size;
        this.sort = sort ? sort : [];
    }

    buildParam(): any {
        // let param = new HttpParams()
        //     .set('page', this.page.toString())
        //     .set('size', this.size.toString());
        let v = [];
        if (this.sort) {
            this.sort.forEach(s => v.push(s.field + ',' + s.direction));
        }
        let param = {
            'page': this.page.toString(),
            'size': this.size.toString(),
            'sort': v
        };
        return param;
    }

}

export class Sort {
    field: string;
    direction: 'asc' | 'desc';
    str: string;

    constructor(field: string, direction?: 'asc' | 'desc') {
        this.field = field;
        this.direction = direction ? direction : 'asc';
        this.str = this.field + ',' + this.direction;
    }
}
