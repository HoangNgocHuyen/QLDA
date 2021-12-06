import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {ResponseObject} from '../../../share/models/response-obj.model';
import {map} from 'rxjs/operators';
import {createRequestOption} from '../../../share/utils/request-util';
import {UserModel} from '../../../modules/auth/_models/user.model';

type EntityResponseType = HttpResponse<ResponseObject<any>>;

@Injectable({providedIn: 'root'})
export class UnitService {
    private BASE_API_URL = `${environment.URL_API}api`;
    status = [
        {
            status: 'ACTIVE',
            desc: 'unit_management.status.active'
        },
        {
            status: 'INACTIVE',
            desc: 'unit_management.status.inactive'
        }
    ];

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<ResponseObject<any>> {
        return this.http
            .get<ResponseObject<any>>(`${this.BASE_API_URL}/units/get-all`, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    searchUnits(pageable?: any, bodyReq?: any): Observable<ResponseObject<any>> {
        const options = createRequestOption(pageable);
        return this.http
            .post<ResponseObject<any>>(`${this.BASE_API_URL}/units/search`, bodyReq, {params: options, observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    createdUnits(req?: UserModel): Observable<ResponseObject<any>> {
        return this.http
            .post<ResponseObject<any>>(`${this.BASE_API_URL}/units`, req, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    updateUnits(req?: UserModel): Observable<ResponseObject<any>> {
        return this.http
            .put<ResponseObject<any>>(`${this.BASE_API_URL}/units`, req, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    deleteUnits(unitCode?: any): Observable<ResponseObject<any>> {
        return this.http
            .delete<ResponseObject<any>>(`${this.BASE_API_URL}/units/${unitCode}`, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

}
