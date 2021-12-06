import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../share/shared.module';
import {AuthGuard} from '../../modules/auth/_services/auth.guard';
import {UserManagementComponent} from './user-management.component';
import {UserManagementCudDialogComponent} from './user-management-cud.dialog.component';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                canActivate: [AuthGuard],
                component: UserManagementComponent,
            }
        ]),
    ],
    declarations: [
        UserManagementComponent,
        UserManagementCudDialogComponent
    ],
    entryComponents: [
        UserManagementCudDialogComponent
    ],
})
export class UserManagementModule {
}
