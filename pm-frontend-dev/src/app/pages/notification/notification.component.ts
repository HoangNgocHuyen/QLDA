import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {NotificationService} from './notification.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Pageable, Sort} from '../../share/dto/Pageable';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl} from '@angular/forms';
import {ShareService} from '../../share/share.service';
import {ToastrService} from 'ngx-toastr';
import {TargetGroupService} from '../category/target-group/target-group.service';
import {Notification, NotificationSearch} from '../../share/models/Notification';

@Component({
    selector: 'notification',
    templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) martSort: MatSort;

    Notifications = new BehaviorSubject<Notification[]>([]);
    loading = new BehaviorSubject<boolean>(false);
    pageable = new Pageable(0, 10);
    total = new BehaviorSubject<number>(0);
    searchFrom = this.fb.group({
        type: new FormControl(null),
        title: new FormControl(null),
        status: new FormControl(null),
        startTime: new FormControl(null),
        endTime: new FormControl(null),
    });

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
        public serviceShare: ShareService,
        public service: NotificationService,
        private toastr: ToastrService,
        private targetGroupService: TargetGroupService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        // this.loadTargetGroup();
    }

    ngAfterViewInit(): void {
        this.martSort.sortables.forEach((v, k) => this.pageable.sort.push(new Sort(v.id, v.start)));
        this.loadNotifications();
    }

    loadNotifications() {
        const search = new NotificationSearch();
        search.status = this.searchFrom.controls.status.value;
        search.title = this.searchFrom.controls.title.value;
        search.type = this.searchFrom.controls.type.value;
        search.startTime = this.searchFrom.controls.startTime.value;
        search.endTime = this.searchFrom.controls.endTime.value;
        this.loading.next(true);
        this.service.search(this.pageable, search)
            .pipe(finalize(() => this.loading.next(false)))
            .subscribe(res => {
                if (res !== null && res.code === '00') {
                    this.Notifications.next(res.data.content);
                    this.total.next(res.data.totalElements);
                } else {
                    this.Notifications.next([]);
                }
            });
    }

    sortData($event) {
        const index = this.pageable.sort.findIndex(s => s.field === $event.active);
        if (index >= 0) {
            this.pageable.sort.splice(index, 1);
        }
        if ($event.direction === '') {
            this.loadNotifications();
            return;
        }
        this.pageable.sort.splice(0, 0, new Sort($event.active, $event.direction));
        this.loadNotifications();
    }

    ngOnDestroy(): void {
    }

    onChangePage($event: PageEvent) {
        this.pageable.size = $event.pageSize;
        this.pageable.page = $event.pageIndex;
        this.loadNotifications();
    }

}
