import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {ResponseObject} from '../../../share/models/response-obj.model';
import {TranslateService} from '@ngx-translate/core';
import {BaseComponent} from '../../BaseComponent';
import {TargetGroupService} from './target-group.service';
import {TargetGroup} from '../../../share/models/target-group';

@Component({
    selector: 'target-group-cud-dialog',
    templateUrl: './target-group-cud.dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class TargetGroupCudDialogComponent extends BaseComponent implements OnInit {

    targetGroup: TargetGroup;
    type: 'CREATED' | 'UPDATED';
    editForm: FormGroup;
    isProcessing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Component constructor
     */
    constructor(
        public dialogRef: MatDialogRef<TargetGroupCudDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private toastService: ToastrService,
        private translateService: TranslateService,
        public service: TargetGroupService,
    ) {
        super();
    }

    /**
     * On init
     */
    ngOnInit() {
        this.targetGroup = this.data.targetGroup;
        this.type = this.data.type;
        this.initForm();
    }

    initForm() {
        this.editForm = this.fb.group({
            code: new FormControl(this.targetGroup.code, [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern('[A-Za-z0-9_]+$')
            ]),
            name: new FormControl(this.targetGroup.name, [
                Validators.required,
                Validators.maxLength(255),
            ]),
            description: new FormControl(this.targetGroup.description, []),
        });
    }

    get frm() {
        if (this.editForm != undefined) {
            return this.editForm.controls;
        }
    }

    save(): void {
        this.isProcessing.next(true);
        const cud = this.editForm.value;
        cud.code = cud.code.toUpperCase();
        cud.id = this.targetGroup.id;
        this.service.save(cud)
            .pipe()
            .subscribe(
                (res) => this.onSaveSuccess(res),
                () => this.onSaveError()
            );
    }


    protected onSaveSuccess(res: ResponseObject<any>): void {
        if (res.code === '00') {
            if (this.type == 'CREATED') {
                this.toastService.success('Tạo mới đơn vị thành công');
            } else {
                this.toastService.success('Cập nhật đơn vị thành công');
            }
            this.dialogRef.close(true);
        } else {
            this.toastService.error(res.desc);
        }
    }

    protected onSaveError(): void {
        this.toastService.error(this.translateService.instant('message.error'));
    }
}
