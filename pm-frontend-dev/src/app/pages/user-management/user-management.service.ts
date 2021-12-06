import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ResponseObject} from '../../share/models/response-obj.model';
import {map} from 'rxjs/operators';
import {createRequestOption} from '../../share/utils/request-util';
import {UserModel} from '../../modules/auth/_models/user.model';

type EntityResponseType = HttpResponse<ResponseObject<any>>;

@Injectable({providedIn: 'root'})
export class UserManagementService {
    private BASE_API_URL = `${environment.URL_API}api/admin`;

    constructor(private http: HttpClient) {
    }

    //<editor-fold desc="[CRUD USER MANAGE]">
    searchUsers(pageable?: any, bodyReq?: any): Observable<ResponseObject<any>> {
        const options = createRequestOption(pageable);
        return this.http
            .post<ResponseObject<any>>(`${this.BASE_API_URL}/users/search`, bodyReq, {params: options, observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    createdUser(req?: UserModel): Observable<ResponseObject<any>> {
        return this.http
            .post<ResponseObject<any>>(`${this.BASE_API_URL}/users`, req, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    updateUser(req?: UserModel): Observable<ResponseObject<any>> {
        return this.http
            .put<ResponseObject<any>>(`${this.BASE_API_URL}/users`, req, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    deleteUser(id?: any): Observable<ResponseObject<any>> {
        return this.http
            .delete<ResponseObject<any>>(`${this.BASE_API_URL}/users/${id}`, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res.body));
    }

    //</editor-fold>
}
