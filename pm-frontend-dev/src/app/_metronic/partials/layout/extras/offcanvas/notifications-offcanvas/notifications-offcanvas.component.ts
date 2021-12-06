import {Component, OnInit} from '@angular/core';
import {LayoutService} from '../../../../../core';
import {WebSocketAPI} from '../../../../../../share/ws/WebSocketAPI';
import {BehaviorSubject} from 'rxjs';
import {NotificationService} from '../../../../../../pages/notification/notification.service';
import {getUserInfo} from '../../../../../../modules/auth/_services/auth.service';
import {Notification} from '../../../../../../share/models/Notification';

@Component({
    selector: 'app-notifications-offcanvas',
    templateUrl: './notifications-offcanvas.component.html',
    styleUrls: ['./notifications-offcanvas.component.scss'],
})
export class NotificationsOffcanvasComponent implements OnInit {
    extrasNotificationsOffcanvasDirectionCSSClass: string;

    messages: BehaviorSubject<Notification[]> = new BehaviorSubject([]);
    userLogin = null;

    constructor(private layout: LayoutService,
                private service: NotificationService,
                public ws: WebSocketAPI
    ) {
        this.userLogin = getUserInfo().login;
        this.ws.messageReceived.subscribe(message => {
            if (message) {
                this.getListNotify();
            }
        });
    }

    ngOnInit(): void {
        this.extrasNotificationsOffcanvasDirectionCSSClass = `offcanvas-${this.layout.getProp(
            'extras.notifications.offcanvas.direction'
        )}`;
        this.getListNotify();
    }

    getListNotify() {
        this.service.getNotificationsByUser(this.userLogin, {page: 0, size: 10}).subscribe(res => {
            if (res.code === '00') {
                console.log(res);
                this.messages.next(res.data);
                let notRead = res.data.filter(t => {
                    return t.status === 'SENT';
                });
                this.ws.messageTotalNews.next(notRead.length);
            }
        });
    }

    markReadMessage(data: Notification) {
        let req = {
            notificationIds: [data.id],
            username: this.userLogin
        };
        this.service.updateWatches(req).subscribe(res => {
            if (res.code === '00') {
                this.getListNotify();
            }
        });
    }
}
