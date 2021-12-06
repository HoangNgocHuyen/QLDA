import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {UserModel} from '../../modules/auth/_models/user.model';
import {UserManagementService} from './user-management.service';
import {ResponseObject} from '../../share/models/response-obj.model';
import {MatDialog} from '@angular/material/dialog';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {UserManagementCudDialogComponent} from './user-management-cud.dialog.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAskComponent} from '../../share/components/modal-ask/modal-ask.component';
import {UnitDTO} from '../../share/dto/UnitDTO';
import {ShareService} from '../../share/share.service';
import {AuthService} from '../../modules/auth/_services/auth.service';
import {finalize} from 'rxjs/operators';
import {BaseComponent, POSITIONS, USER_STATUS} from '../BaseComponent';

@Component({
    selector: 'user-management',
    templateUrl: './user-management.component.html',
    styleUrls: []
})
export class UserManagementComponent extends BaseComponent implements OnInit {

    users: BehaviorSubject<UserModel[]> = new BehaviorSubject<UserModel[]>([]);
    units: BehaviorSubject<UnitDTO[]> = new BehaviorSubject<UnitDTO[]>([]);
    positions: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    status: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(USER_STATUS);
    searchForm: FormGroup;
    processingSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private route: Router,
        private dialog: MatDialog,
        protected modalService: NgbModal,
        private translateService: TranslateService,
        public service: UserManagementService,
        public shareService: ShareService,
        public authService: AuthService,
    ) {
        super();
        this.userIdentity = authService.currentUserSubject.value;
        this.getPositions();
    }

    ngOnInit(): void {
        this.initForm();
        this.searchUsers();
        this.getUnits();
    }

    initForm() {
        this.searchForm = this.fb.group({
            login: new FormControl(null, Validators.maxLength(50)),
            fullName: new FormControl(null, Validators.maxLength(50)),
            email: new FormControl(null, Validators.maxLength(50)),
            activated: new FormControl(null),
            unitCode: new FormControl(this.userIdentity?.unitCode),
            position: new FormControl(null),
        });
    }

    get frm() {
        if (this.searchForm != undefined) {
            return this.searchForm.controls;
        }
    }

    pageChange(_event) {
        this.pageIndex = _event.pageIndex;
        this.pageSize = _event.pageSize;
        this.searchUsers();
    }

    private sort(): string[] {
        return ['id' + ',' + (this.ascending ? 'asc' : 'desc')];
    }

    searchUsers() {
        this.processingSearch.next(true);
        let bodyReq = this.searchForm.value;
        let pageable = {
            page: this.pageIndex,
            size: this.pageSize,
            sort: this.sort()
        };
        this.service.searchUsers(pageable, bodyReq)
            .pipe(finalize(() => this.processingSearch.next(false)))
            .subscribe(
                (res: ResponseObject<any>) => {
                    if (res.code === '00') {
                        this.users.next(res.data.content);
                        this.totalElement = res.data.totalElements;
                    }
                },
                () => {
                    this.toastService.error(this.translateService.instant('message.error'));
                }
            );
    }

    getUnits() {
        this.shareService.getUnits().subscribe(
            (res: UnitDTO[]) => {
                this.units.next(res);
            }
        );
    }

    getPositions() {
        if (this.userAuthorities === this.roleEnums.ROLE_ADMIN &&
            (!this.userIdentity.unitCode || this.userIdentity.unitCode === this.unitCodeSpecial)) {
            this.positions.next(POSITIONS);
            return;
        } else {
            const items = POSITIONS.filter(t => {
                return t.position !== 'ADMIN';
            });
            this.positions.next(items);
        }
    }

    activeUser(_event: MatSlideToggleChange, user: UserModel) {
        user.activated = _event.checked;
        this.service.updateUser(user).subscribe(
            (res: ResponseObject<any>) => {
                this.searchUsers();
            },
            () => {
                this.toastService.error(this.translateService.instant('message.error'));
            }
        );
    }

    createOrUpdateUser(user: any) {
        if (this.userIdentity.unitCode && this.userIdentity.unitCode !== this.unitCodeSpecial) {
            user.unitCode = this.userIdentity.unitCode;
        }
        const dialogRef = this.dialog.open(UserManagementCudDialogComponent, {
            data: {
                user: user,
                units: this.units
            }
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.searchUsers();
            }
        });
    }

    deleteUser(user: UserModel) {
        const modalRef = this.modalService.open(ModalAskComponent, {
            size: 'md'
        });
        modalRef.componentInstance.content = 'Bạn có chắc chắn muốn xóa user [' + user.login + '] [' + user.fullName + '] không?';
        modalRef.componentInstance.title = 'Thông báo';
        modalRef.result.then(res => {
            if (!res) {
                return;
            }
            this.service.deleteUser(user.login).subscribe(
                (res: ResponseObject<any>) => {
                    this.toastService.success('Xóa user thành công.');
                    this.searchUsers();
                },
                () => {
                    this.toastService.error(this.translateService.instant('message.error'));
                }
            );
        });
    }

    getViewUnit(unitCode: string) {
        const item = this.units.getValue().filter(t => {
            return t.unitCode === unitCode;
        });
        if (item && item.length > 0) {
            return item[0].unitName;
        }
        return unitCode;
    }
}
