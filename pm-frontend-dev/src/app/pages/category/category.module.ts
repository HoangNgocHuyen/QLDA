import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CategoryComponent} from './category.component';
import {SharedModule} from '../../share/shared.module';
import {AuthGuard} from '../../modules/auth/_services/auth.guard';
import {UnitComponent} from './unit/unit.component';
import {UnitCudDialogComponent} from './unit/unit-cud.dialog.component';
import {RegionComponent} from './region/region.component';
import {RegionCudDialogComponent} from './region/region-cud.dialog.component';
import {TargetGroupComponent} from './target-group/target-group.component';
import {TargetGroupCudDialogComponent} from './target-group/target-group-cud.dialog.component';

const routes: Routes = [
    {
        path: '',
        component: CategoryComponent,
        children: [
            {
                path: 'region',
                component: RegionComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'unit',
                component: UnitComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'target-groups',
                component: TargetGroupComponent,
                canActivate: [AuthGuard],
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        CategoryComponent,
        RegionComponent,
        UnitComponent,
        TargetGroupComponent,

        UnitCudDialogComponent,
        RegionCudDialogComponent,
        TargetGroupCudDialogComponent
    ],
    entryComponents: [
        UnitCudDialogComponent,
        RegionCudDialogComponent,
        TargetGroupCudDialogComponent
    ]
})
export class CategoryModule {
}
