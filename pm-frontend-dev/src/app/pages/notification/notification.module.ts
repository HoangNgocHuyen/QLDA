import {Injectable, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterModule} from '@angular/router';

import {NotificationComponent} from './notification.component';
import {SharedModule} from '../../share/shared.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AuthGuard} from '../../modules/auth/_services/auth.guard';
import {Target} from '../../share/models/target';
import {NotificationService} from './notification.service';
import {EMPTY, Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {ResDTO} from '../../share/dto/ResDTO';
import {NotificationDetailComponent} from './notification-detail.component';
import {NotificationUpdateComponent} from './notification-update.component';
import {Notification} from '../../share/models/Notification';

@Injectable({providedIn: 'root'})
export class NotificationResolve implements Resolve<Notification> {
    constructor(private service: NotificationService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<Notification> | Observable<never> {
        const id = route.params['id'];
        if (id) {
            return this.service.find(id).pipe(
                flatMap((res: ResDTO<Notification>) => {
                    if (res.data) {
                        return of(res.data);
                    } else {
                        this.router.navigate(['404']);
                        return EMPTY;
                    }
                })
            );
        }
        return of(new Notification());
    }
}

@NgModule({
    declarations: [
        NotificationComponent,
        NotificationDetailComponent,
        NotificationUpdateComponent
    ],
    imports: [
        SharedModule,
        MatProgressSpinnerModule,
        MatSortModule,
        PerfectScrollbarModule,
        RouterModule.forChild([
            {
                path: '',
                component: NotificationComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                    defaultSort: 'id,asc',
                },
            },
            {
                path: ':id/view',
                component: NotificationDetailComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                },
                resolve: {
                    notification: NotificationResolve,
                },
            },
            {
                path: ':id/edit',
                component: NotificationUpdateComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                },
                resolve: {
                    notification: NotificationResolve,
                },
            },
            {
                path: 'add',
                component: NotificationUpdateComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                },
                resolve: {
                    notification: NotificationResolve,
                },
            }
        ])
    ]
})
export class NotificationModule {
}
