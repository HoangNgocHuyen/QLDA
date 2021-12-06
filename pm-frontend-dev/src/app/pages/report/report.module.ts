import {NgModule} from '@angular/core';

import {ReportComponent} from './report.component';
import {RouterModule} from '@angular/router';
import {AuthGuard} from '../../modules/auth/_services/auth.guard';
import {ChartModule} from 'angular-highcharts';

@NgModule({
    declarations: [
        ReportComponent,
    ],
    imports: [
        ChartModule,
        RouterModule.forChild([
            {
                path: '',
                component: ReportComponent,
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_ADMIN'],
                    defaultSort: 'id,asc',
                },
            }
        ])
    ]
})
export class ReportModule {
}
