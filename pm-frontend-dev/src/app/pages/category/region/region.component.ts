import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
import {RegionService} from './region.service';
import {RegionCudDialogComponent} from './region-cud.dialog.component';
import {RegionDTO} from '../../../share/dto/RegionDTO';
import {filterRegion, findRegionCode, getViewRegion} from '../function-common';
import {BaseComponent} from '../../BaseComponent';

@Component({
    selector: 'region',
    templateUrl: './region.component.html',
    styleUrls: []
})
export class RegionComponent extends BaseComponent implements OnInit, OnDestroy {

    regions: BehaviorSubject<RegionDTO[]> = new BehaviorSubject<RegionDTO[]>([]);
    areas: BehaviorSubject<RegionDTO[]> = new BehaviorSubject<RegionDTO[]>([]);
    provincesRaw: RegionDTO[] = [];
    provinces: BehaviorSubject<RegionDTO[]> = new BehaviorSubject<RegionDTO[]>([]);
    processingSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    searchForm: FormGroup;

    //Fn Common
    getViewRegion = getViewRegion;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private route: Router,
        private dialog: MatDialog,
        protected modalService: NgbModal,
        private translateService: TranslateService,
        public service: RegionService,
        private shareService: ShareService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.initForm();
        this.searchRegions(true);
        this.getAreas();
        this.getProvinces();
    }

    initForm() {
        this.searchForm = this.fb.group({
            code: new FormControl(null, Validators.maxLength(50)),
            name: new FormControl(null, Validators.maxLength(255)),
            type: new FormControl('AREA'),
            provinceCode: new FormControl(null),
            regionCode: new FormControl(null)
        });

        this.frm.type.valueChanges.subscribe(type => {
            if (type === 'AREA') {
                this.frm.provinceCode.setValue(null);
                this.frm.regionCode.setValue(null);
            } else if (type === 'PROVINCE') {
                this.frm.regionCode.setValue(null);
            }
        });

        this.frm.regionCode.valueChanges.subscribe(value => {
            this.provinces.next(filterRegion(null, value, this.provincesRaw));
        });

        this.frm.provinceCode.valueChanges.subscribe(value => {
            this.frm.regionCode.setValue(findRegionCode(value, this.provincesRaw));
        });

        this.frm.type.valueChanges.subscribe(value => {
            this.searchRegions(true, value);
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
        this.searchRegions(true);
    }

    private sort(): string[] {
        return ['code' + ',' + (this.ascending ? 'asc' : 'desc')];
    }

    searchRegions(force: boolean, type?: string) {
        this.processingSearch.next(true);
        if (force) {
            this.pageIndex = 0;
        }
        let bodyReq = this.searchForm.value;
        if (type) {
            bodyReq.type = type;
        }
        let pageable = {
            page: this.pageIndex,
            size: this.pageSize,
            sort: this.sort()
        };
        this.service.search(pageable, bodyReq)
            .pipe(finalize(() => this.processingSearch.next(false)))
            .subscribe(
                (res: ResponseObject<any>) => {
                    if (res.code === '00') {
                        this.regions.next(res.data.content);
                        this.totalElement = res.data.totalElements;
                    }
                },
                () => {
                    this.toastService.error(this.translateService.instant('message.error'));
                }
            );
    }

    getAreas(force?: boolean) {
        this.shareService.getAreas(force).subscribe(res => {
            this.areas.next(res);
        });
    }

    getProvinces(force?: boolean) {
        this.shareService.getProvinces(force).subscribe(res => {
            this.provincesRaw = res;
            this.provinces.next(res);
        });
    }

    createOrUpdate(region: RegionDTO, action: 'CREATED' | 'UPDATED') {
        region.type = this.searchForm.value.type;
        const dialogRef = this.dialog.open(RegionCudDialogComponent, {
            data: {
                region: region,
                areas: this.areas,
                provincesRaw: this.provincesRaw,
                action: action
            }
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.searchRegions(false);
                this.getProvinces(true);
                this.getAreas(true);
            }
        });
    }

    deleteUnit(region: RegionDTO) {
        const modalRef = this.modalService.open(ModalAskComponent, {
            size: 'md'
        });
        modalRef.componentInstance.content = 'Bạn có chắc chắn muốn xóa khu vực [' + region.name + '] không?';
        modalRef.componentInstance.title = 'Thông báo';
        modalRef.result.then(res => {
            if (!res) {
                return;
            }
            this.service.delete(region.code).subscribe(
                () => {
                    this.toastService.success('Xóa khu vực thành công.');
                    this.searchRegions(false);
                },
                () => {
                    this.toastService.error(this.translateService.instant('message.error'));
                }
            );
        });
    }

    ngOnDestroy(): void {
        this.regions.complete();
    }
}
