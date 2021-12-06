import {NgModule} from '@angular/core';
import {SharedLibsModule} from './shared-libs.module';
import {ModalAskComponent} from './components/modal-ask/modal-ask.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {APP_DATE_FORMATS, AppDateAdapter} from './utils/format-datepicker';
import {TrimFormFieldsDirective} from './directives/trim-space.directive';
import {TrimSpaceBeginEndDirective} from './directives/trim-space-begin-end.directive';
import {ChangePasswordDialogComponent} from '../modules/auth/change-password/change-password.dialog.component';
import {DatePipe} from '@angular/common';
import {ShowFileUploadComponent} from './components/show-file-upload/show-file-upload.component';
import {CmActionAnyPermissionDirective} from "./directives/cm-action-any-permission.directive";
import {CmActionPermissionDirective} from "./directives/cm-action-permission.directive";


@NgModule({
    imports: [
        SharedLibsModule
    ],
    declarations: [
        ModalAskComponent,
        TrimFormFieldsDirective,
        TrimSpaceBeginEndDirective,
        CmActionAnyPermissionDirective,
        CmActionPermissionDirective,
        ChangePasswordDialogComponent,
        ShowFileUploadComponent
    ],
    exports: [
        SharedLibsModule,
        TrimFormFieldsDirective,
        TrimSpaceBeginEndDirective,
        CmActionAnyPermissionDirective,
        CmActionPermissionDirective,
        ShowFileUploadComponent,
    ],
    entryComponents: [
        ModalAskComponent,
        ChangePasswordDialogComponent
    ],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
        {provide: MAT_DATE_LOCALE, useValue: 'vi-VN'},
    ],
})
export class SharedModule {

}
