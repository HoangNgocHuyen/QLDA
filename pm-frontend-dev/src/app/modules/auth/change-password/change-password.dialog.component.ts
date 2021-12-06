import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AuthHTTPService} from '../_services/auth-http';

@Component({
    selector: 'change-password-dialog',
    templateUrl: './change-password.dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ChangePasswordDialogComponent implements OnInit {

    editForm: FormGroup;
    isProcessing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Component constructor
     */
    constructor(
        public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private toastService: ToastrService,
        private translateService: TranslateService,
        private authHTTPService: AuthHTTPService
    ) {

    }

    /**
     * On init
     */
    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.editForm = this.fb.group({
            currentPassword: new FormControl(null, [
                Validators.required,
                Validators.maxLength(60)
            ]),
            newPassword: new FormControl(null, [
                Validators.required,
                Validators.maxLength(60)
            ])
        });
    }

    get frm() {
        if (this.editForm != undefined) {
            return this.editForm.controls;
        }
    }

    save(): void {
        this.isProcessing.next(true);
        this.authHTTPService.changePassword(this.editForm.value).subscribe(
            () => {
                this.toastService.success('Thay đổi mật khẩu thành công');
                this.dialogRef.close(true);
            },
            (error) => {
                if (error?.error?.title) {
                    this.toastService.error(error.error.title);
                } else {
                    this.toastService.error(this.translateService.instant('message.error'));
                }
                this.dialogRef.close(true);
            }
        );
    }
}
