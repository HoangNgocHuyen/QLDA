import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Notification} from '../../share/models/Notification';

@Component({
    selector: 'notification-detail',
    templateUrl: './notification-detail.component.html',
})
export class NotificationDetailComponent implements OnInit {
    notification: Notification | null = null;

    constructor(protected activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({notification}) => {
            this.notification = notification;
        });
    }

    previousState(): void {
        window.history.back();
    }

}
