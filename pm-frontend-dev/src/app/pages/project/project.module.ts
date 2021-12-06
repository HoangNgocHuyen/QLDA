import {Injectable, NgModule} from '@angular/core';

import {ProjectComponent} from './project.component';
import {SharedModule} from '../../share/shared.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {ActivatedRouteSnapshot, Resolve, Router, RouterModule} from '@angular/router';
import {AuthGuard} from '../../modules/auth/_services/auth.guard';
import {ProjectDetailComponent} from './project-detail.component';
import {EMPTY, Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {Project} from '../../share/models/project';
import {ProjectService} from './project.service';
import {ProjectUpdateComponent} from './project-update.component';
import {TargetGroupDialogComponent} from './target-group.dialog.component';
import {PmoDialogComponent} from './pmo.dialog.component';

@Injectable({providedIn: 'root'})
export class ProjectResolve implements Resolve<Project> {
    constructor(private service: ProjectService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<Project> | Observable<never> {
        const id = route.params['id'];
        if (id) {
            return this.service.find(id).pipe(
                flatMap((res: Project) => {
                    if (res) {
                        return of(res);
                    } else {
                        this.router.navigate(['404']);
                        return EMPTY;
                    }
                })
            );
        }
        return of(new Project());
    }
}

@NgModule({
    declarations: [
        ProjectComponent,
        ProjectDetailComponent,
        ProjectUpdateComponent,
        TargetGroupDialogComponent,
        PmoDialogComponent
    ],
    imports: [
        SharedModule,
        MatProgressSpinnerModule,
        MatSortModule,
        PerfectScrollbarModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProjectComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                    defaultSort: 'id,asc',
                },
            },
            {
                path: ':id/view',
                component: ProjectDetailComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                },
                resolve: {
                    project: ProjectResolve,
                },
            },
            {
                path: 'new',
                component: ProjectUpdateComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                }
            },
            {
                path: 'edit',
                component: ProjectUpdateComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                }
            }
        ])
    ]
})
export class ProjectModule {
}
