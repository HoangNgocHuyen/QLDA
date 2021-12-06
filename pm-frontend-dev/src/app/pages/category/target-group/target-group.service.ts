import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResDTO} from '../../../share/dto/ResDTO';
import {map} from 'rxjs/operators';
import {TargetGroup} from '../../../share/models/target-group';
import {environment as env} from '../../../../environments/environment';
import {SUCCESS_CODE} from '../../../share/constants/input.constants';
import {ResponseObject} from '../../../share/models/response-obj.model';
import {createRequestOption} from '../../../share/utils/request-util';

@Injectable({providedIn: 'root'})
export class TargetGroupService {
    public resourceUrl = env.URL_API + 'api/category/target-groups';

    constructor(protected http: HttpClient) {
    }

    findAll(): Observable<TargetGroup[]> {
        return this.http.get(`${this.resourceUrl}`)
            .pipe(map((res: ResDTO<TargetGroup[]>) => {
                if (res.code === SUCCESS_CODE && res.data) {
                    return res.data;
                }
                return [];
            }));
    }

    search(pageable?: any, bodyReq?: any): Observable<ResponseObject<any>> {
        const options = createRequestOption(pageable);
        return this.http
            .post<ResponseObject<any>>(`${this.resourceUrl}/search`, bodyReq, {params: options, observe: 'response'})
            .pipe(map((res: HttpResponse<ResponseObject<any>>) => res.body));
    }

    projectTargetGroupByProject(code: string): Observable<TargetGroup[]> {
        return this.http.get(`${this.resourceUrl}/get-by-project-code?projectCode=` + code)
            .pipe(map((res: ResDTO<TargetGroup[]>) => {
                if (res.code === SUCCESS_CODE && res.data) {
                    return res.data;
                }
                return [];
            }));
    }

    save(group: TargetGroup): Observable<ResDTO<any>> {
        return this.http
            .post(`${this.resourceUrl}`,
                group,
                {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<any>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    delete(id?: number): Observable<ResDTO<any>> {
        return this.http
            .delete(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<any>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

}
