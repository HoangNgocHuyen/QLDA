import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, ReplaySubject, Subscription} from 'rxjs';
import {catchError, finalize, map, switchMap} from 'rxjs/operators';
import {UserModel} from '../_models/user.model';
import {AuthModel} from '../_models/auth.model';
import {AuthHTTPService} from './auth-http';
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';
import {WebSocketAPI} from '../../../share/ws/WebSocketAPI';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    // private fields
    private userIdentity: UserModel | null = null;
    private authenticationState = new ReplaySubject<UserModel | null>(1);
    private unsubscribe: Subscription[] = [];
    private isLoadingSubject: BehaviorSubject<boolean>;
    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

    // public fields
    currentUser$: Observable<UserModel>;
    isLoading$: Observable<boolean>;
    currentUserSubject: BehaviorSubject<UserModel>;

    get currentUserValue(): UserModel {
        return this.currentUserSubject.value;
    }

    constructor(
        private authHttpService: AuthHTTPService,
        private router: Router,
        private ws: WebSocketAPI
    ) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.isLoading$ = this.isLoadingSubject.asObservable();
        const subscr = this.getUserByToken().subscribe();
        this.unsubscribe.push(subscr);
    }

    authenticate(identity: UserModel | null): void {
        this.userIdentity = identity;
        this.authenticationState.next(this.userIdentity);
        if (identity) {
            sessionStorage.setItem(this.authLocalStorageToken + '_USER_INFO', JSON.stringify(identity));
            console.log('TODO: connect');
            this.ws._connect(identity.login);
        } else {
            console.log('TODO: disconnect');
            this.ws._disconnect();
        }
    }

    // public methods
    login(username: string, password: string): Observable<UserModel> {
        this.isLoadingSubject.next(true);
        return this.authHttpService.login(username, password).pipe(
            map((auth: AuthModel) => {
                return this.setAuthFromLocalStorage(auth);
            }),
            switchMap(() => this.getUserByToken()),
            catchError((err) => {
                console.error('err', err);
                return of(undefined);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/auth/login'], {
            queryParams: {},
        });
    }

    getUserByToken(): Observable<UserModel> {
        const auth = this.getAuthFromLocalStorage();
        if (!auth || !auth.id_token) {
            return of(undefined);
        }
        this.isLoadingSubject.next(true);
        return this.authHttpService.getUserByToken().pipe(
            map((user: UserModel) => {
                if (user) {
                    this.currentUserSubject = new BehaviorSubject<UserModel>(user);
                    this.authenticate(user);
                } else {
                    this.logout();
                }
                return user;
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    public getAuthenticationState(): Observable<UserModel | null> {
        return this.authenticationState.asObservable();
    }

    hasAnyAuthority(role: string): boolean {
        if (!this.userIdentity || !this.userIdentity.authorities) {
            return false;
        }
        return this.userIdentity.authorities.includes(role);
    }

    // private methods
    private setAuthFromLocalStorage(auth: AuthModel): boolean {
        if (auth && auth.id_token) {
            localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
            return true;
        }
        return false;
    }

    public getAuthFromLocalStorage(): AuthModel {
        try {
            return JSON.parse(
                localStorage.getItem(this.authLocalStorageToken)
            );
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}

export function getUserInfo(): UserModel {
    let authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    try {
        return JSON.parse(sessionStorage.getItem(authLocalStorageToken + '_USER_INFO'));
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export function getAuthorities(): String {
    let authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    try {
        const userInfo: UserModel = JSON.parse(sessionStorage.getItem(authLocalStorageToken + '_USER_INFO'));
        return userInfo.authorities[0];
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
