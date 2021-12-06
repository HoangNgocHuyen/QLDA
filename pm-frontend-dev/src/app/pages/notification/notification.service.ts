import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment as env} from '../../../environments/environment';
import {ResDTO} from '../../share/dto/ResDTO';
import {PageableRes} from '../../share/dto/PageableRes';
import {Pageable} from '../../share/dto/Pageable';
import {ResponseObject} from '../../share/models/response-obj.model';
import {Notification, NotificationSearch} from '../../share/models/Notification';

@Injectable({providedIn: 'root'})
export class NotificationService {
    public resourceUrl = env.URL_API + 'api/notifications';

    status = [
        {
            status: 'PENDING',
            desc: 'notification.status.PENDING'
        },
        {
            status: 'SENT',
            desc: 'notification.status.IN_PROGRESS'
        },
        {
            status: 'FAILED',
            desc: 'notification.status.FINISHED'
        },
        {
            status: 'WATCHED',
            desc: 'notification.status.CLOSED'
        }
    ];

    types = [
        {
            type: 'USER',
            desc: 'notification.type.USER'
        },
        {
            type: 'UNIT',
            desc: 'notification.type.UNIT'
        },
        {
            type: 'PROJECT',
            desc: 'notification.type.PROJECT'
        },
        {
            type: 'LIST_USER',
            desc: 'notification.type.LIST_USER'
        },
        {
            type: 'TASK',
            desc: 'notification.type.TASK'
        }
    ];

    constructor(protected http: HttpClient) {
    }

    search(pageable: Pageable, search: NotificationSearch): Observable<ResDTO<PageableRes<Notification>>> {
        return this.http.post(
            `${this.resourceUrl}/search`,
            search,
            {params: pageable.buildParam(), observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<PageableRes<Notification>>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    find(id: number): Observable<ResDTO<Notification>> {
        return this.http
            .get(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<Notification>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    create(req?: Notification): Observable<ResDTO<Notification>> {
        return this.http
            .post<ResponseObject<any>>(`${this.resourceUrl}`, req, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<Notification>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    update(req?: Notification): Observable<ResDTO<Notification>> {
        return this.http
            .put<ResponseObject<any>>(`${this.resourceUrl}`, req, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<Notification>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    getNotificationsByUser(user: string, req?: any): Observable<ResDTO<Notification[]>> {
        return this.http
            .post<ResponseObject<any>>(`${this.resourceUrl}/get-by-user/${user}`, req, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<Notification[]>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    updateWatches(req?: any): Observable<ResDTO<any>> {
        return this.http
            .post<ResponseObject<any>>(`${this.resourceUrl}/usser-update-watched`, req, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<any>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }
}
