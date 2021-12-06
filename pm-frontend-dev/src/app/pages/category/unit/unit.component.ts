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
import {UnitService} from './unit.service';
import {UnitCudDialogComponent} from './unit-cud.dialog.component';
import {ShareService} from '../../../share/share.service';
import {RegionDTO} from '../../../share/dto/RegionDTO';
import {UnitDTO} from '../../../share/dto/UnitDTO';
import {finalize} from 'rxjs/operators';
import {BaseComponent} from '../../BaseComponent';

@Component({
    selector: 'unit',
    templateUrl: './unit.component.html',
    styleUrls: []
})
export class UnitComponent extends BaseComponent implements OnInit {

    units: BehaviorSubject<UnitDTO[]> = new BehaviorSubject<UnitDTO[]>([]);
    regions: BehaviorSubject<RegionDTO[]> = new BehaviorSubject<RegionDTO[]>([]);
    searchForm: FormGroup;
    processingSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private route: Router,
        private dialog: MatDialog,
        protected modalService: NgbModal,
        private translateService: TranslateService,
        public service: UnitService,
        public shareService: ShareService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.initForm();
        this.searchUnits(true);
        this.getRegions();
    }

    initForm() {
        this.searchForm = this.fb.group({
            unitCode: new FormControl(null),
            unitName: new FormControl(null),
            status: new FormControl(null),
            regionCode: new FormControl(null),
            areaCode: new FormControl(null)
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
        this.searchUnits(true);
    }

    private sort(): string[] {
        return ['unitCode' + ',' + (this.ascending ? 'asc' : 'desc')];
    }

    searchUnits(force: boolean) {
        this.processingSearch.next(true);
        if (force) {
            this.pageIndex = 0;
        }
        let bodyReq = this.searchForm.value;
        let pageable = {
            page: this.pageIndex,
            size: this.pageSize,
            sort: this.sort()
        };
        this.service.searchUnits(pageable, bodyReq)
            .pipe(finalize(() => this.processingSearch.next(false)))
            .subscribe(
                (res: ResponseObject<any>) => {
                    if (res.code === '00') {
                        this.units.next(res.data.content);
                        this.totalElement = res.data.totalElements;
                    }
                },
                () => {
                    this.toastService.error(this.translateService.instant('message.error'));
                }
            );
    }

    getRegions() {
        this.shareService.getRegions().subscribe(res => {
            this.regions.next(res);
        });
    }

    createOrUpdate(unit: UnitDTO | {}, type: 'CREATED' | 'UPDATED') {
        const dialogRef = this.dialog.open(UnitCudDialogComponent, {
            data: {
                unit: unit,
                regions: this.regions,
                type: type
            }
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.searchUnits(false);
            }
        });
    }

    deleteUnit(unit: UnitDTO) {
        const modalRef = this.modalService.open(ModalAskComponent, {
            size: 'md'
        });
        modalRef.componentInstance.content = 'Bạn có chắc chắn muốn xóa đơn vị [' + unit.unitName + '] không?';
        modalRef.componentInstance.title = 'Thông báo';
        modalRef.result.then(res => {
            if (!res) {
                return;
            }
            this.service.deleteUnits(unit.unitCode).subscribe(
                () => {
                    this.toastService.success('Xóa đơn vị thành công.');
                    this.searchUnits(false);
                },
                () => {
                    this.toastService.error(this.translateService.instant('message.error'));
                }
            );
        });
    }
}
