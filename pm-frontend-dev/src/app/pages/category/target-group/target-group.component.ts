import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {ResponseObject} from '../../../share/models/response-obj.model';
import {MatDialog} from '@angular/material/dialog';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAskComponent} from '../../../share/components/modal-ask/modal-ask.component';
import {ShareService} from '../../../share/share.service';
import {finalize} from 'rxjs/operators';
import {BaseComponent} from '../../BaseComponent';
import {TargetGroup} from '../../../share/models/target-group';
import {TargetGroupService} from './target-group.service';
import {ERROR_TITLE, SUCCESS_CODE} from '../../../share/constants/input.constants';
import {TargetGroupCudDialogComponent} from './target-group-cud.dialog.component';

@Component({
    selector: 'target-group',
    templateUrl: './target-group.component.html',
    styleUrls: []
})
export class TargetGroupComponent extends BaseComponent implements OnInit {

    targetGroups: BehaviorSubject<TargetGroup[]> = new BehaviorSubject<TargetGroup[]>([]);
    searchForm: FormGroup;
    processingSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private route: Router,
        private dialog: MatDialog,
        protected modalService: NgbModal,
        private translateService: TranslateService,
        public service: TargetGroupService,
        public shareService: ShareService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.initForm();
        this.searchTargetGroups(true);
    }

    initForm() {
        this.searchForm = this.fb.group({
            code: new FormControl(null),
            name: new FormControl(null)
        });
    }

    get frm() {
        if (this.searchForm != undefined) {
            return this.searchForm.controls;
        }
    }

    // tslint:disable-next-line:variable-name
    pageChange(_event) {
        this.pageIndex = _event.pageIndex;
        this.pageSize = _event.pageSize;
        this.searchTargetGroups(true);
    }

    private sort(): string[] {
        return ['code' + ',' + (this.ascending ? 'asc' : 'desc')];
    }

    createOrUpdate(group: TargetGroup | {}, type: 'CREATED' | 'UPDATED') {
        const dialogRef = this.dialog.open(TargetGroupCudDialogComponent, {
            data: {
                targetGroup: group,
                type: type
            }
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.searchTargetGroups(false);
            }
        });
    }

    searchTargetGroups(force: boolean) {
        this.processingSearch.next(true);
        if (force) {
            this.pageIndex = 0;
        }
        const bodyReq = this.searchForm.value;
        const pageable = {
            page: this.pageIndex,
            size: this.pageSize,
            sort: this.sort()
        };
        this.service.search(pageable, bodyReq)
            .pipe(finalize(() => this.processingSearch.next(false)))
            .subscribe(
                (res: ResponseObject<any>) => {
                    if (res.code === '00') {
                        this.targetGroups.next(res.data.content);
                        this.totalElement = res.data.totalElements;
                    }
                },
                () => {
                    this.toastService.error(this.translateService.instant('message.error'));
                }
            );
    }

    deleteTargetGroup(group: TargetGroup) {
        const modalRef = this.modalService.open(ModalAskComponent, {
            size: 'md'
        });
        modalRef.componentInstance.content = 'Bạn có chắc chắn muốn xóa đơn vị [' + group.name + '] không?';
        modalRef.componentInstance.title = 'Thông báo';
        modalRef.result.then(res => {
            if (!res) {
                return;
            }
            this.service.delete(group.id).subscribe(
            r => {
                    if (r.code !== SUCCESS_CODE) {
                        this.toastService.error(r.desc, ERROR_TITLE);
                        return;
                    }
                    this.searchTargetGroups(false);
                },
                () => {
                    this.toastService.error(this.translateService.instant('message.error'));
                }
            );
        });
    }
}
