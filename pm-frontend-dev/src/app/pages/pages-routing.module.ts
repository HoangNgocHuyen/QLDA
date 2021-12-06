import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './_layout/layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
            },
            {
                path: 'user-management',
                loadChildren: () => import('./user-management/user-management.module').then((m) => m.UserManagementModule),
            },
            {
                path: 'project',
                loadChildren: () => import('./project/project.module').then((m) => m.ProjectModule),
            },
            {
                path: 'category',
                loadChildren: () => import('./category/category.module').then((m) => m.CategoryModule),
            },
            {
                path: 'target',
                loadChildren: () => import('./target/target.module').then((m) => m.TargetModule),
            },
            {
                path: 'task',
                loadChildren: () => import('./task/task.module').then((m) => m.TaskModule),
            },
            {
                path: 'report',
                loadChildren: () => import('./report/report.module').then((m) => m.ReportModule),
            },
            {
                path: 'notification',
                loadChildren: () => import('./notification/notification.module').then((m) => m.NotificationModule),
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            {
                path: '**',
                redirectTo: 'errors/404',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}
