import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {ProjectService} from './project.service';
import {Project} from '../../share/models/project';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {BehaviorSubject} from 'rxjs';
import {Pageable, Sort} from '../../share/dto/Pageable';
import {finalize} from 'rxjs/operators';
import {ProjectSearchDTO} from '../../share/dto/ProjectSearchDTO';
import {FormBuilder} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {DATE_FORMAT_DDMMYYYY, PAGE_OPTIONS} from '../../share/constants/input.constants';

@Component({
    selector: 'project',
    templateUrl: './project.component.html',
})
export class ProjectComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) martSort: MatSort;

    projects = new BehaviorSubject<Project[]>([]);
    loading = new BehaviorSubject<boolean>(false);
    pageable = new Pageable(0, 10);
    total = new BehaviorSubject<number>(0);
    pageOptions = PAGE_OPTIONS;

    searchFrom = this.fb.group({
        code: [''],
        name: [''],
        startDate: [null],
        endDate: [null],
    });

    constructor(
        protected service: ProjectService,
        private fb: FormBuilder,
        protected router: Router,
        public datePipe: DatePipe
    ) {
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.martSort.sortables.forEach((v, k) => this.pageable.sort.push(new Sort(v.id, v.start)));
        this.loadPage();
    }

    loadPage(): void {
        let search = new ProjectSearchDTO();
        search.code = this.searchFrom.controls.code.value;
        search.name = this.searchFrom.controls.name.value;
        search.startDate = this.datePipe.transform(this.searchFrom.controls.startDate.value, DATE_FORMAT_DDMMYYYY);
        search.endDate = this.datePipe.transform(this.searchFrom.controls.endDate.value, DATE_FORMAT_DDMMYYYY);

        this.service.searchNew(this.pageable, search)
            .pipe(finalize(() => this.loading.next(false)))
            .subscribe(res => {
                if (res !== null && res.code === '00') {
                    this.projects.next(res.data.content);
                    this.total.next(res.data.totalElements);
                } else {
                    this.projects.next([]);
                }
            });
    }

    sortData($event) {
        const index = this.pageable.sort.findIndex(s => s.field === $event.active);
        if (index >= 0) {
            this.pageable.sort.splice(index, 1);
        }
        if ($event.direction === '') {
            this.loadPage();
            return;
        }
        this.pageable.sort.splice(0, 0, new Sort($event.active, $event.direction));
        this.loadPage();
    }

    ngOnDestroy(): void {
    }

    onChangePage($event: PageEvent) {
        this.pageable.size = $event.pageSize;
        this.pageable.page = $event.pageIndex;
        this.loadPage();
    }

    addProject() {

    }

}
