import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {ResponseObject} from '../../../share/models/response-obj.model';
import {TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs/operators';
import {RegionService} from './region.service';
import {RegionDTO} from '../../../share/dto/RegionDTO';
import {filterRegion, findRegionCode} from '../function-common';
import {BaseComponent} from '../../BaseComponent';

@Component({
    selector: 'region-cud-dialog',
    templateUrl: './region-cud.dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RegionCudDialogComponent extends BaseComponent implements OnInit {

    region: RegionDTO;
    areas: BehaviorSubject<RegionDTO[]>;
    provincesRaw: RegionDTO[];
    provinces: BehaviorSubject<RegionDTO[]> = new BehaviorSubject<RegionDTO[]>([]);
    action: 'CREATED' | 'UPDATED';
    editForm: FormGroup;
    isProcessing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Component constructor
     */
    constructor(
        public dialogRef: MatDialogRef<RegionCudDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private toastService: ToastrService,
        private translateService: TranslateService,
        public service: RegionService
    ) {
        super();
    }

    /**
     * On init
     */
    ngOnInit() {
        this.region = this.data.region;
        this.areas = this.data.areas;
        this.provincesRaw = this.data.provincesRaw;
        this.provinces.next(this.provincesRaw);
        this.action = this.data.action;
        this.initForm();
    }

    initForm() {
        this.editForm = this.fb.group({
            code: new FormControl(this.region.code, [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern('[A-Za-z0-9._]+$')
            ]),
            name: new FormControl(this.region.name, [
                Validators.required,
                Validators.maxLength(255),
            ]),
            provinceCode: new FormControl(this.region.provinceCode),
            regionCode: new FormControl(this.region.regionCode),
            type: new FormControl(this.region.type)
        });
        this.updateValidators(this.region.type);

        this.frm.regionCode.valueChanges.subscribe(value => {
            this.provinces.next(filterRegion(null, value, this.provincesRaw));
        });

        this.frm.provinceCode.valueChanges.subscribe(value => {
            this.frm.regionCode.setValue(findRegionCode(value, this.provincesRaw));
        });

        this.frm.type.valueChanges.subscribe(value => {
            this.frm.regionCode.setValue(null);
            this.frm.provinceCode.setValue(null);
            this.updateValidators(value);
        });
    }

    get frm() {
        if (this.editForm != undefined) {
            return this.editForm.controls;
        }
    }

    updateValidators(type: string) {
        this.frm.regionCode.setValidators([]);
        this.frm.provinceCode.setValidators([]);
        if (['PROVINCE', 'DISTRICT'].includes(type)) {
            this.frm.regionCode.setValidators(Validators.required);
        }
        if (['DISTRICT'].includes(type)) {
            this.frm.provinceCode.setValidators(Validators.required);
        }
        this.frm.provinceCode.updateValueAndValidity();
        this.frm.regionCode.updateValueAndValidity();
    }

    save(): void {
        this.isProcessing.next(true);
        let cud = this.editForm.value;
        cud.code = cud.code.toUpperCase();
        if (this.action == 'UPDATED') {
            this.service.update(cud)
                .pipe(finalize(() => this.isProcessing.next(false)))
                .subscribe(
                    (res) => this.onSaveSuccess(res),
                    (error) => this.onSaveError(error)
                );
        } else {
            this.service.created(cud)
                .pipe(finalize(() => this.isProcessing.next(false)))
                .subscribe(
                    (res) => this.onSaveSuccess(res),
                    (error) => this.onSaveError(error)
                );
        }
    }


    protected onSaveSuccess(res: ResponseObject<any>): void {
        if (res.code === '00') {
            if (this.action == 'CREATED') {
                this.toastService.success('Tạo mới khu vực thành công');
            } else {
                this.toastService.success('Cập nhật khu vực thành công');
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
