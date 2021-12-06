import {Injectable, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterModule} from '@angular/router';

import {TargetComponent} from './target.component';
import {SharedModule} from '../../share/shared.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AuthGuard} from '../../modules/auth/_services/auth.guard';
import {Target} from '../../share/models/target';
import {TargetService} from './target.service';
import {EMPTY, Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {ResDTO} from '../../share/dto/ResDTO';
import {TargetDetailComponent} from './target-detail.component';
import {TargetUpdateComponent} from './target-update.component';
import {TargetAddExcelComponent} from './target-add-excel.component';

@Injectable({providedIn: 'root'})
export class TargetResolve implements Resolve<Target> {
    constructor(private service: TargetService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<Target> | Observable<never> {
        const id = route.params['id'];
        if (id) {
            return this.service.find(id).pipe(
                flatMap((res: ResDTO<Target>) => {
                    if (res.data) {
                        return of(res.data);
                    } else {
                        this.router.navigate(['404']);
                        return EMPTY;
                    }
                })
            );
        }
        return of(new Target());
    }
}

@NgModule({
    declarations: [
        TargetComponent,
        TargetDetailComponent,
        TargetUpdateComponent,
        TargetAddExcelComponent
    ],
    imports: [
        SharedModule,
        MatProgressSpinnerModule,
        MatSortModule,
        PerfectScrollbarModule,
        RouterModule.forChild([
            {
                path: '',
                component: TargetComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                    defaultSort: 'id,asc',
                },
            },
            {
                path: ':id/view',
                component: TargetDetailComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                },
                resolve: {
                    target: TargetResolve,
                },
            },
            {
                path: ':id/edit',
                component: TargetUpdateComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                },
                resolve: {
                    target: TargetResolve,
                },
            },
            {
                path: 'add',
                component: TargetUpdateComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                },
                resolve: {
                    target: TargetResolve,
                },
            },
            {
                path: 'add-excel',
                component: TargetAddExcelComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                },
                resolve: {
                    target: TargetResolve,
                },
            }
        ])
    ]
})
export class TargetModule {
}
