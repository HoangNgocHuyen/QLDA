import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {ResponseObject} from '../../../share/models/response-obj.model';
import {TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs/operators';
import {UnitService} from './unit.service';
import {RegionDTO} from '../../../share/dto/RegionDTO';
import {UnitDTO} from '../../../share/dto/UnitDTO';
import {BaseComponent} from '../../BaseComponent';

@Component({
    selector: 'unit-cud-dialog',
    templateUrl: './unit-cud.dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class UnitCudDialogComponent extends BaseComponent implements OnInit {

    unit: UnitDTO;
    regions: BehaviorSubject<RegionDTO[]> = new BehaviorSubject<RegionDTO[]>([]);
    type: 'CREATED' | 'UPDATED';
    editForm: FormGroup;
    isProcessing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Component constructor
     */
    constructor(
        public dialogRef: MatDialogRef<UnitCudDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private toastService: ToastrService,
        private translateService: TranslateService,
        public service: UnitService
    ) {
        super();
    }

    /**
     * On init
     */
    ngOnInit() {
        this.unit = this.data.unit;
        this.regions = this.data.regions;
        this.type = this.data.type;
        this.initForm();
    }

    initForm() {
        this.editForm = this.fb.group({
            unitCode: new FormControl(this.unit.unitCode, [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern('[A-Za-z0-9_]+$')
            ]),
            unitName: new FormControl(this.unit.unitName, [
                Validators.required,
                Validators.maxLength(255),
            ]),
        });
    }

    get frm() {
        if (this.editForm != undefined) {
            return this.editForm.controls;
        }
    }

    save(): void {
        this.isProcessing.next(true);
        let cud = this.editForm.value;
        cud.unitCode = cud.unitCode.toUpperCase();
        if (this.type == 'UPDATED') {
            this.service.updateUnits(cud)
                .pipe(finalize(() => this.isProcessing.next(false)))
                .subscribe(
                    (res) => this.onSaveSuccess(res),
                    (error) => this.onSaveError(error)
                );
        } else {
            this.service.createdUnits(cud)
                .pipe(finalize(() => this.isProcessing.next(false)))
                .subscribe(
                    (res) => this.onSaveSuccess(res),
                    (error) => this.onSaveError(error)
                );
        }
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

    protected onSaveError(error): void {
        this.toastService.error(this.translateService.instant('message.error'));
    }
}
