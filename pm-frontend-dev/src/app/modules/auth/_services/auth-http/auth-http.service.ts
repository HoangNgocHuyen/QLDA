import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {map} from "rxjs/operators";
import {environment as env} from "../../../../../environments/environment";
import {AuthModel} from "../../_models/auth.model";
import {UserModel} from "../../_models/user.model";

type EntityResponseType<T> = HttpResponse<T>;

@Injectable({
    providedIn: 'root',
})
export class AuthHTTPService {
    constructor(private http: HttpClient) {
    }

    login(username: string, password: string): Observable<AuthModel> {
        return this.http.post<AuthModel>(env.URL_API + 'api/authenticate', {
            username: username,
            password: password
        }, {observe: 'response'}).pipe(map((res: EntityResponseType<AuthModel>) => res.body));
    }

    getUserByToken(): Observable<UserModel> {
        return this.http.get<UserModel>(env.URL_API + 'api/account', {observe: 'response'})
            .pipe(map((res: EntityResponseType<UserModel>) => res.body));
    }

    changePassword(body?: any): Observable<any> {
        return this.http.post<any>(env.URL_API + 'api/account/change-password', body, {observe: 'response'})
            .pipe(map((res: EntityResponseType<UserModel>) => res.body));
    }
}
