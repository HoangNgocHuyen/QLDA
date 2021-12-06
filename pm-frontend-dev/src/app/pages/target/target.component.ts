import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {Target, TargetSearch} from '../../share/models/target';
import {TargetService} from './target.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Pageable, Sort} from '../../share/dto/Pageable';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl} from '@angular/forms';
import {ProjectTargetGroup} from '../../share/dto/ProjectTargetGroup';
import {UnitDTO} from '../../share/dto/UnitDTO';
import {ShareService} from '../../share/share.service';
import {ToastrService} from 'ngx-toastr';
import {TargetGroupService} from '../category/target-group/target-group.service';

@Component({
    selector: 'target',
    templateUrl: './target.component.html',
})
export class TargetComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) martSort: MatSort;

    Groups = new BehaviorSubject<ProjectTargetGroup[]>([]);
    Units = new BehaviorSubject<UnitDTO[]>([]);
    projectCode: string;
    projectName: string;
    targets = new BehaviorSubject<Target[]>([]);
    loading = new BehaviorSubject<boolean>(false);
    pageable = new Pageable(0, 10);
    totalTarget = new BehaviorSubject<number>(0);
    searchFrom = this.fb.group({
        code: new FormControl(null),
        title: new FormControl(null),
        projectCode: new FormControl(null),
        projectName: new FormControl(null),
        groupCode: new FormControl(null),
        unitCode: new FormControl(null),
        status: new FormControl(null),
        startTime: new FormControl(null),
        endTime: new FormControl(null),
    });

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
        public serviceShare: ShareService,
        public service: TargetService,
        private toastr: ToastrService,
        private targetGroupService: TargetGroupService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((res) => {
            this.projectCode = res.projectCode;
            this.projectName = res.projectName;
        });
        this.loadTargetGroup();
        this.searchFrom.controls.projectName.setValue(this.projectName);
    }

    ngAfterViewInit(): void {
        this.martSort.sortables.forEach((v, k) => this.pageable.sort.push(new Sort(v.id, v.start)));
        this.loadTargets();
    }

    loadTargets() {
        if (!this.projectCode) {
            return;
        }
        const search = new TargetSearch();
        search.status = this.searchFrom.controls.status.value;
        search.code = this.searchFrom.controls.code.value;
        search.title = this.searchFrom.controls.title.value;
        search.projectCode = this.projectCode;
        search.groupCode = this.searchFrom.controls.groupCode.value;
        search.startTime = this.searchFrom.controls.startTime.value;
        search.endTime = this.searchFrom.controls.endTime.value;
        search.unitCode = this.searchFrom.controls.unitCode.value;
        this.loading.next(true);
        this.service.searchNew(this.pageable, search)
            .pipe(finalize(() => this.loading.next(false)))
            .subscribe(res => {
                if (res !== null && res.code === '00') {
                    this.targets.next(res.data.content);
                    this.totalTarget.next(res.data.totalElements);
                } else {
                    this.targets.next([]);
                }
            });
    }

    sortData($event) {
        const index = this.pageable.sort.findIndex(s => s.field === $event.active);
        if (index >= 0) {
            this.pageable.sort.splice(index, 1);
        }
        if ($event.direction === '') {
            this.loadTargets();
            return;
        }
        this.pageable.sort.splice(0, 0, new Sort($event.active, $event.direction));
        this.loadTargets();
    }

    ngOnDestroy(): void {
    }

    onChangePage($event: PageEvent) {
        this.pageable.size = $event.pageSize;
        this.pageable.page = $event.pageIndex;
        this.loadTargets();
    }

    loadTargetGroup() {
        this.targetGroupService.projectTargetGroupByProject(this.projectCode).subscribe(
            res => {
                this.Groups.next(res);
            }
        );
    }

}
