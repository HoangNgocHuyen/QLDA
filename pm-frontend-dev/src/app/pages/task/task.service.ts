import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment as env} from '../../../environments/environment';
import {ResDTO} from '../../share/dto/ResDTO';
import {PageableRes} from '../../share/dto/PageableRes';
import {Pageable} from '../../share/dto/Pageable';
import {ResponseObject} from '../../share/models/response-obj.model';
import {TaskDTO, TaskSearchDTO} from '../../share/dto/TaskDTO';

type EntityResponseType = HttpResponse<ResDTO<any>>;

@Injectable({providedIn: 'root'})
export class TaskService {
    public resourceUrl = env.URL_API + 'api/tasks';

    status = [
        {status: 'OPEN', desc: 'Chưa thực hiện'},
        {status: 'CLOSED', desc: 'Hoàn thành'}
    ];

    type = [
        {type: 'WORK', desc: 'Công việc'},
        {type: 'MEETING_SCHEDULE', desc: 'Lịch họp'}
    ];

    confirmObjectDefault = [
        {
            id: null,
            objectConfirm: 'S101',
            objectConfirmName: 'S101',
            taskId: null,
            status: 'WAITING_APPROVE',
            reason: null
        },
        {
            id: null,
            objectConfirm: 'CONTRACTORS',
            objectConfirmName: 'Nhà thầu',
            taskId: null,
            status: 'WAITING_APPROVE',
            reason: null
        },
        {
            id: null,
            objectConfirm: 'OWNER',
            objectConfirmName: 'Chủ sử dụng',
            taskId: null,
            status: 'WAITING_APPROVE',
            reason: null
        }
    ];

    confirmStatus = [
        {
            confirmStatus: 'APPROVE',
            desc: 'Chấp nhận'
        },
        {
            confirmStatus: 'REJECT',
            desc: 'Từ chối'
        },
        {
            confirmStatus: 'WAITING_APPROVE',
            desc: 'Chờ duyệt'
        },
        {
            confirmStatus: 'RECEIVED',
            desc: 'Đã nhận'
        }
    ];

    constructor(protected http: HttpClient) {
    }

    search(pageable: Pageable, search: TaskSearchDTO): Observable<ResDTO<PageableRes<TaskDTO>>> {
        return this.http
            .post(`${this.resourceUrl}/search`, search, {params: pageable.buildParam(), observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    find(id: number): Observable<ResDTO<TaskDTO>> {
        return this.http
            .get(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    create(req?: TaskDTO): Observable<ResDTO<TaskDTO>> {
        return this.http
            .post<ResponseObject<any>>(`${this.resourceUrl}`, req, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    update(req?: TaskDTO): Observable<ResDTO<any>> {
        return this.http
            .put<ResponseObject<any>>(`${this.resourceUrl}`, req, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }
}
