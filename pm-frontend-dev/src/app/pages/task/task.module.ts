import {Injectable, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterModule} from '@angular/router';

import {TaskComponent} from './task.component';
import {SharedModule} from '../../share/shared.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AuthGuard} from '../../modules/auth/_services/auth.guard';
import {TaskService} from './task.service';
import {EMPTY, Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {ResDTO} from '../../share/dto/ResDTO';
import {TaskDetailComponent} from './task-detail.component';
import {TaskUpdateComponent} from './task-update.component';
import {TaskDTO} from '../../share/dto/TaskDTO';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';

@Injectable({providedIn: 'root'})
export class TaskResolve implements Resolve<TaskDTO> {
    constructor(private service: TaskService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<TaskDTO> | Observable<never> {
        const id = route.params['id'];
        if (id) {
            return this.service.find(id).pipe(
                flatMap((res: ResDTO<TaskDTO>) => {
                    if (res.data) {
                        return of(res.data);
                    } else {
                        this.router.navigate(['404']).then();
                        return EMPTY;
                    }
                })
            );
        }
        return of(new TaskDTO());
    }
}

@NgModule({
    declarations: [
        TaskComponent,
        TaskDetailComponent,
        TaskUpdateComponent
    ],
    imports: [
        SharedModule,
        MatProgressSpinnerModule,
        MatSortModule,
        PerfectScrollbarModule,
        RouterModule.forChild([
            {
                path: '',
                component: TaskComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                    defaultSort: 'id,asc',
                },
            },
            {
                path: ':id/view',
                component: TaskDetailComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                },
                resolve: {
                    task: TaskResolve,
                },
            },
            {
                path: ':id/edit',
                component: TaskUpdateComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                },
                resolve: {
                    task: TaskResolve,
                },
            },
            {
                path: 'add',
                component: TaskUpdateComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_USER'],
                },
                resolve: {
                    task: TaskResolve,
                },
            }
        ])
    ],
    providers: [
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
                hasBackdrop: true,
                panelClass: 'mat-dialog-container-wrapper',
                height: 'auto',
                width: '400px'
            }
        }
    ]
})
export class TaskModule {
}
