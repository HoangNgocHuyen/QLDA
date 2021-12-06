import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment as env} from '../../../environments/environment';
import {ResDTO} from '../../share/dto/ResDTO';
import {Target, TargetSearch} from '../../share/models/target';
import {PageableRes} from '../../share/dto/PageableRes';
import {Pageable} from '../../share/dto/Pageable';
import {ResponseObject} from '../../share/models/response-obj.model';

@Injectable({providedIn: 'root'})
export class TargetService {
    public resourceUrl = env.URL_API + 'api/targets';

    status = [
        {
            status: 'NEW',
            desc: 'target.status.NEW'
        },
        {
            status: 'PENDING',
            desc: 'target.status.PENDING'
        },
        {
            status: 'IN_PROGRESS',
            desc: 'target.status.IN_PROGRESS'
        },
        {
            status: 'FINISHED',
            desc: 'target.status.FINISHED'
        },
        {
            status: 'CLOSED',
            desc: 'target.status.CLOSED'
        }
    ];

    constructor(protected http: HttpClient) {
    }

    search(pageable: Pageable, search: TargetSearch): Observable<ResDTO<PageableRes<Target>>> {
        return this.http.post(
            `${this.resourceUrl}/search`,
            search,
            {params: pageable.buildParam(), observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<PageableRes<Target>>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    searchNew(pageable: Pageable, search: TargetSearch): Observable<ResDTO<PageableRes<Target>>> {
        return this.http.post(
            `${this.resourceUrl}/search-new`,
            search,
            {params: pageable.buildParam(), observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<PageableRes<Target>>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    find(id: number): Observable<ResDTO<Target>> {
        return this.http
            .get(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<Target>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    create(req?: Target): Observable<ResDTO<Target>> {
        return this.http
            .post<ResponseObject<any>>(`${this.resourceUrl}`, req, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<Target>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    update(req?: Target): Observable<ResDTO<Target>> {
        return this.http
            .put<ResponseObject<any>>(`${this.resourceUrl}`, req, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<Target>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    addByExcel(req: any): Observable<ResDTO<Target[]>> {
        return this.http
            .post<ResponseObject<any>>(`${this.resourceUrl}/add-by-excel`, req, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<Target[]>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }
}
