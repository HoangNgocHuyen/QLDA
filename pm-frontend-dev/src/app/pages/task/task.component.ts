import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {TaskDTO, TaskSearchDTO} from '../../share/dto/TaskDTO';
import {TaskService} from './task.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Pageable, Sort} from '../../share/dto/Pageable';
import {MatSort} from '@angular/material/sort';
import {FormBuilder} from '@angular/forms';
import {BaseComponent} from '../BaseComponent';
import {UnitDTO} from '../../share/dto/UnitDTO';
import {ShareService} from '../../share/share.service';
import {getViewRegion, getViewUnit} from '../category/function-common';

@Component({
    selector: 'task',
    templateUrl: './task.component.html',
})
export class TaskComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) martSort: MatSort;

    taskType = [
        {code: 'BOTH', name: 'Tất cả'},
        {code: 'WORK', name: 'Công việc'},
        {code: 'MEETING_SCHEDULE', name: 'Lịch họp'}
    ];

    tasks = new BehaviorSubject<TaskDTO[]>([]);
    loading = new BehaviorSubject<boolean>(false);
    units: UnitDTO[] = [];
    pageable = new Pageable(0, 10);
    totalTask = new BehaviorSubject<number>(0);
    searchFrom = this.fb.group({
        projectCode: [null],
        targetCode: [null],
        code: [null],
        name: [null],
        parentCode: [null],
        type: ['BOTH'],
        startDate: [null],
        endDate: [null],
    });
    getViewUnit = getViewUnit;

    constructor(
        protected router: Router,
        public service: TaskService,
        public shareService: ShareService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit(): void {
        this.getUnits();
    }

    ngAfterViewInit(): void {
        this.martSort.sortables.forEach((v, k) => this.pageable.sort.push(new Sort(v.id, v.start)));
        this.loadTasks();
    }

    loadTasks() {
        const search = new TaskSearchDTO();
        search.projectCode = this.searchFrom.controls.projectCode.value;
        search.targetCode = this.searchFrom.controls.targetCode.value;
        search.code = this.searchFrom.controls.code.value;
        search.name = this.searchFrom.controls.name.value;
        search.parentCode = this.searchFrom.controls.parentCode.value;
        search.type = this.searchFrom.controls.type.value === 'BOTH' ? null : this.searchFrom.controls.type.value;
        search.startDate = this.searchFrom.controls.startDate.value;
        search.endDate = this.searchFrom.controls.endDate.value;
        // search.userId = 1;

        this.loading.next(true);
        this.service.search(this.pageable, search)
            .pipe(finalize(() => this.loading.next(false)))
            .subscribe(res => {
                if (res !== null && res.code === '00') {
                    this.tasks.next(res.data.content);
                    this.totalTask.next(res.data.totalElements);
                } else {
                    this.tasks.next([]);
                }
            });
    }

    sortData($event) {
        const index = this.pageable.sort.findIndex(s => s.field === $event.active);
        if (index >= 0) {
            this.pageable.sort.splice(index, 1);
        }
        if ($event.direction === '') {
            this.loadTasks();
            return;
        }
        this.pageable.sort.splice(0, 0, new Sort($event.active, $event.direction));
        this.loadTasks();
    }

    getUnits(){
        this.shareService.getUnits().subscribe(res => {
            this.units = res;
        })
    }

    ngOnDestroy(): void {
    }

    onChangePage($event: PageEvent) {
        this.pageable.size = $event.pageSize;
        this.pageable.page = $event.pageIndex;
        this.loadTasks();
    }
}
