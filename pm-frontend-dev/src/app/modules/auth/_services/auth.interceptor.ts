import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthModel} from '../_models/auth.model';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

    constructor(
        private router: Router
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!request || !request.url) {
            return next.handle(request);
        }

        if (request.url === environment.URL_API + 'api/authenticate') {
            return next.handle(request);
        }

        return this.addAuthorization(request, next);
    }

    protected addAuthorization(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authModel = this.getAuthFromLocalStorage();
        if (authModel) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + authModel.id_token
                }
            });
        } else {
            this.router.navigateByUrl('/auth/login');
            return;
        }
        return next.handle(request);
    }

    protected getAuthFromLocalStorage(): AuthModel {
        try {
            return JSON.parse(
                localStorage.getItem(this.authLocalStorageToken)
            );
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
}
