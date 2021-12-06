import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {UserManagementService} from './user-management.service';
import {UserModel} from '../../modules/auth/_models/user.model';
import {ResponseObject} from '../../share/models/response-obj.model';
import {TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs/operators';
import {UnitDTO} from '../../share/dto/UnitDTO';
import {RolesEnums, UNIT_SPECIAL} from '../../share/constants/roles.enums';
import {BaseComponent, POSITIONS, USER_STATUS} from '../BaseComponent';

@Component({
    selector: 'user-management-cud-dialog',
    templateUrl: './user-management-cud.dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class UserManagementCudDialogComponent extends BaseComponent implements OnInit {

    user: UserModel;
    units: BehaviorSubject<UnitDTO[]> = new BehaviorSubject<UnitDTO[]>([]);
    positions: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    status: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(USER_STATUS);
    editForm: FormGroup;
    isProcessing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Component constructor
     */
    constructor(
        public dialogRef: MatDialogRef<UserManagementCudDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private toastService: ToastrService,
        private translateService: TranslateService,
        public service: UserManagementService
    ) {
        super();
    }

    /**
     * On init
     */
    ngOnInit() {
        this.user = this.data.user;
        this.units = this.data.units;
        this.initForm();
        this.getPositions();
    }

    initForm() {
        this.editForm = this.fb.group({
            id: new FormControl(this.user.id),
            login: new FormControl(this.user.login, [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern('[A-Za-z0-9.]+$')
            ]),
            fullName: new FormControl(this.user.fullName, [
                Validators.required,
                Validators.maxLength(50),
            ]),
            email: new FormControl(this.user.email, [
                Validators.required,
                Validators.maxLength(50),
                Validators.email
            ]),
            activated: new FormControl(this.user.activated != null ? this.user.activated : true, Validators.required),
            langKey: new FormControl(this.user.langKey ? this.user.langKey : 'vn', Validators.required),
            authorities: new FormControl(this.user.authorities, Validators.required),
            mobile: new FormControl(this.user.mobile, [
                Validators.required,
                Validators.minLength(9),
                Validators.maxLength(10),
                Validators.pattern('[0-9]+$')
            ]),
            position: new FormControl(this.user.position, Validators.required),
            unitCode: new FormControl(this.user.unitCode, Validators.required)
        });

        this.frm.position.valueChanges.subscribe(value => {
            this.frm.authorities.setValue([this.buildRole(value, this.editForm.value.unitCode)]);
        });

        this.frm.unitCode.valueChanges.subscribe(value => {
            this.frm.authorities.setValue([this.buildRole(this.editForm.value.position, value)]);
        });
    }

    buildRole(position: string, unitCode: string) {
        if (position === 'LEADER' && unitCode === UNIT_SPECIAL) {
            return RolesEnums.ROLE_LEADER_SPECIAL;
        }
        if (position === 'LEADER' && unitCode !== UNIT_SPECIAL) {
            return RolesEnums.ROLE_LEADER;
        }
        if (position === 'EMPLOYEE' && unitCode === UNIT_SPECIAL) {
            return RolesEnums.ROLE_EMPLOYEE_SPECIAL;
        }
        if (position === 'EMPLOYEE' && unitCode !== UNIT_SPECIAL) {
            return RolesEnums.ROLE_EMPLOYEE;
        }
        if (position === 'ADMIN') {
            return RolesEnums.ROLE_ADMIN;
        }
    }

    getPositions() {
        if ((this.user.login && this.user.position === 'ADMIN') || this.userIdentity.login === 'admin') {
            this.positions.next(POSITIONS);
        } else {
            const item = POSITIONS.filter(t => {
                return t.position !== 'ADMIN';
            });
            console.log(item);
            this.positions.next(item);
        }
    }

    get frm() {
        if (this.editForm != undefined) {
            return this.editForm.controls;
        }
    }

    save(): void {
        this.isProcessing.next(true);
        let userCud = this.editForm.value;
        if (userCud.id !== null && userCud.id !== undefined) {
            this.service.updateUser(userCud)
                .pipe(finalize(() => this.isProcessing.next(false)))
                .subscribe(
                    (res) => this.onSaveSuccess(res),
                    (error) => this.onSaveError(error)
                );
        } else {
            this.service.createdUser(userCud)
                .pipe(finalize(() => this.isProcessing.next(false)))
                .subscribe(
                    (res) => this.onSaveSuccess(res),
                    (error) => this.onSaveError(error)
                );
        }
    }


    protected onSaveSuccess(res: ResponseObject<any>): void {
        if (res.code === '00') {
            if (this.user.id == null) {
                this.toastService.success('Tạo mới user thành công');
            } else {
                this.toastService.success('Cập nhật user thành công');
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
