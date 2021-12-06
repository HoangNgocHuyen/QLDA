import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {ResponseObject} from '../../../share/models/response-obj.model';
import {map} from 'rxjs/operators';
import {createRequestOption} from '../../../share/utils/request-util';
import {RegionDTO} from '../../../share/dto/RegionDTO';

type EntityResponseType = HttpResponse<ResponseObject<any>>;

@Injectable({providedIn: 'root'})
export class RegionService {
    private BASE_API_URL = `${environment.URL_API}api`;

    regionType = [
        {
            type: 'AREA',
            desc: 'Vùng/miền'
        },
        {
            type: 'PROVINCE',
            desc: 'Tỉnh/bộ'
        },
        {
            type: 'DISTRICT',
            desc: 'Huyện/sở'
        }
    ];

    constructor(private http: HttpClient) {
    }

    //<editor-fold desc="[CRUD REGION MANAGE]">
    search(pageable?: any, bodyReq?: any): Observable<ResponseObject<any>> {
        const options = createRequestOption(pageable);
        return this.http
            .post<ResponseObject<any>>(`${this.BASE_API_URL}/regions/search`, bodyReq, {params: options, observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    created(req?: RegionDTO): Observable<ResponseObject<any>> {
        return this.http
            .post<ResponseObject<any>>(`${this.BASE_API_URL}/regions`, req, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    update(req?: RegionDTO): Observable<ResponseObject<any>> {
        return this.http
            .put<ResponseObject<any>>(`${this.BASE_API_URL}/regions`, req, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    delete(code?: any): Observable<ResponseObject<any>> {
        return this.http
            .delete<ResponseObject<any>>(`${this.BASE_API_URL}/regions/${code}`, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    //</editor-fold>
}
