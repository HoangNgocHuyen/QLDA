import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TargetGroupService} from '../category/target-group/target-group.service';
import {ToastrService} from 'ngx-toastr';
import {ERROR_TITLE, SUCCESS_CODE, SUCCESS_TITLE} from '../../share/constants/input.constants';
import {ProjectService} from './project.service';
import {FormBuilder, Validators} from '@angular/forms';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {CreateProjectDTO} from '../../share/dto/CreateProjectDTO';
import {TargetGroup} from '../../share/models/target-group';
import {ShareService} from '../../share/share.service';
import {UserModel} from '../../modules/auth/_models/user.model';
import {MatDialog} from '@angular/material/dialog';
import {TargetGroupDialogComponent} from './target-group.dialog.component';
import {SpinnerServiceExt} from '../../share/spinner-service-ext';
import {finalize} from 'rxjs/operators';
import {AREA_LIST, CacheService, DISTRICT_LIST, PROVINCE_LIST} from '../../share/utils/cache.service';
import {RegionDTO} from '../../share/dto/RegionDTO';
import {UnitDTO} from '../../share/dto/UnitDTO';
import {PmoDialogComponent} from './pmo.dialog.component';

@Component({
    selector: 'project-update',
    templateUrl: './project-update.component.html',
})
export class ProjectUpdateComponent implements OnInit, OnDestroy {

    projectStatus = [{code: 'ACTIVE', name: 'Hoạt động'}, {code: 'INACTIVE', name: 'Không hoạt động'}, {code: 'DELETE', name: 'Xóa'}];
    projectId: number = null;
    areas = new BehaviorSubject<RegionDTO[]>([]);
    provinces = new BehaviorSubject<RegionDTO[]>([]);
    districts = new BehaviorSubject<RegionDTO[]>([]);
    units = new BehaviorSubject<UnitDTO[]>([]);
    unitsAll: UnitDTO[] = [];
    users = new BehaviorSubject<UserModel[]>([]);
    pmos = new BehaviorSubject<UserModel[]>([]);
    usersSelected = new BehaviorSubject<UserModel[]>([]);
    pmosAll: UserModel[] = [];
    targetGroups = new BehaviorSubject<TargetGroup[]>([]);
    targetGroupsSelected = new BehaviorSubject<TargetGroup[]>([]);

    form = this.fb.group({
        code: ['', [Validators.required]],
        name: ['', [Validators.required]],
        area: ['', [Validators.required]],
        province: ['', [Validators.required]],
        district: ['', [Validators.required]],
        unit: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        pmo: ['', [Validators.required]],
        status: ['', [Validators.required]],
        note: ['']
    });

    constructor(
        private route: ActivatedRoute,
        private targetGroupService: TargetGroupService,
        private projectService: ProjectService,
        private shareService: ShareService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private spinner: SpinnerServiceExt,
        private cache: CacheService
    ) {
    }

    ngOnInit(): void {
        this.spinner.show('ngOnInit');
        combineLatest([
            this.route.queryParams,
            this.shareService.getRegions(),
            this.shareService.getUnits(),
            this.shareService.getAllUsers(),
            this.targetGroupService.findAll()
        ]).subscribe(([param, regions, units, users, targetGroups]) => {
            // console.log(users);
            this.areas.next(regions);
            this.units.next(units);
            this.unitsAll = units;
            // this.users.next(users);
            // this.pmos.next(users);
            this.pmos.next(users.filter(u => u.authorities[0] === 'ROLE_LEADER_SPECIAL' || u.authorities[0] === 'ROLE_LEADER'));
            this.users.next(users.filter(u => u.authorities[0] === 'ROLE_EMPLOYEE_SPECIAL' || u.authorities[0] === 'ROLE_EMPLOYEE'));
            this.pmosAll = users;
            this.targetGroups.next(targetGroups);

            if (param && param.id) {
                this.loadProject(param.id);
                this.loadSelectedTargetGroup(param.code);
                this.loadSelectedUsers(param.code);
            }
            this.spinner.hide('ngOnInit');
        });

        this.targetGroups.subscribe(tg => this.targetGroupsSelected.next(tg.filter(t => t.selected === true)));
        this.users.subscribe(pu => this.usersSelected.next(pu.filter(t => t.selected === true)));
    }

    ngOnDestroy(): void {
        this.units.complete();
        this.users.complete();
        this.pmos.complete();
        this.usersSelected.complete();
        this.areas.complete();
        this.targetGroups.complete();
        this.targetGroupsSelected.complete();
    }

    loadProject(projectId: number) {
        this.spinner.show('loadProject');
        this.projectService.find(projectId)
            .pipe(finalize(() => this.spinner.hide('loadProject')))
            .subscribe(
                res => {
                    const project = res;
                    this.projectId = project.id;
                    this.form.patchValue({
                        code: project.code,
                        name: project.name,
                        area: project.area,
                        province: project.province,
                        district: project.district,
                        unit: project.unit,
                        startDate: new Date(project.startDate),
                        endDate: new Date(project.endDate),
                        pmo: project.pmoUser,
                        status: project.status,
                        note: project.note,
                    });
                    this.areaChange(false);
                    this.provinceChange(false);
                    this.unitChange(false);
                },
                error => {
                    this.toastr.error(error.message, ERROR_TITLE);
                }
            );
    }

    loadSelectedTargetGroup(projectCode: string) {
        this.spinner.show('loadSelectedTargetGroup');
        this.projectService.findSelectedTargetGroup(projectCode)
            .pipe(finalize(() => this.spinner.hide('loadSelectedTargetGroup')))
            .subscribe(
                res => {
                    this.targetGroups.value.forEach(tg => {
                        const index = res.findIndex(t => t === tg.code);
                        tg.selected = index >= 0;
                    });
                    this.targetGroups.next(this.targetGroups.value);
                },
                error => this.toastr.error(error.message, ERROR_TITLE)
            );
    }

    loadSelectedUsers(projectCode: string) {
        this.spinner.show('loadSelectedUsers');
        this.projectService.findSelectedProjectUser(projectCode)
            .pipe(finalize(() => this.spinner.hide('loadSelectedUsers')))
            .subscribe(
                res => {
                    this.users.value.forEach(u => {
                        const index = res.findIndex(t => t.id === u.id);
                        u.selected = index >= 0;
                    });
                    this.users.next(this.users.value);
                },
                error => this.toastr.error(error.message, ERROR_TITLE)
            );
    }

    save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.spinner.show();
        const project = new CreateProjectDTO();
        project.id = this.projectId;
        project.code = this.form.controls.code.value;
        project.name = this.form.controls.name.value;
        project.pmoUser = this.form.controls.pmo.value;
        project.area = this.form.controls.area.value;
        project.province = this.form.controls.province.value;
        project.district = this.form.controls.district.value;
        project.unit = this.form.controls.unit.value;
        project.startDate = this.form.controls.startDate.value;
        project.endDate = this.form.controls.endDate.value;
        project.status = this.form.controls.status.value;
        project.note = this.form.controls.note.value;
        project.targetGroups = this.targetGroupsSelected.value;
        project.users = this.usersSelected.value;

        this.projectService.save(project)
            .pipe(finalize(() => this.spinner.hide()))
            .subscribe(
                res => {
                    if (res.code !== SUCCESS_CODE) {
                        this.toastr.error(res.desc, ERROR_TITLE);
                        return;
                    }
                    this.toastr.success('Lưu dữ liệu thành công', SUCCESS_TITLE);
                    this.previousState();
                },
                error => this.toastr.error(error.message, ERROR_TITLE)
            );

    }

    addTarget() {
        const dialogRef = this.dialog.open(TargetGroupDialogComponent, {
            data: {
                targetGroups: this.targetGroups.value
            },
            width: '600px'
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.targetGroups.next(res);
            }
        });
    }

    addPmos() {
        const dialogRef = this.dialog.open(PmoDialogComponent, {
            data: {
                users: this.users.value
            },
            width: '600px'
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.users.next(res);
            }
        });
    }

    removeTargetGroup(code: string) {
        this.targetGroups.value.forEach(tg => {
            if (tg.code === code) {
                tg.selected = false;
            }
        });
        this.targetGroups.next(this.targetGroups.value);
    }

    removePmo(id: number) {
        this.users.value.forEach(tg => {
            if (tg.id === id) {
                tg.selected = false;
            }
        });
        this.users.next(this.users.value);
    }

    get frm() {
        // tslint:disable-next-line:triple-equals
        if (this.form != undefined) {
            return this.form.controls;
        }
    }

    projectCodeBlur() {
        if (!this.form.controls.code.value) {
            return;
        }
        this.shareService.getAllProjectCode().subscribe(
            res => {
                const ck = res.find(c => c === this.form.controls.code.value);
                if (ck && this.projectId == null) {
                    this.form.controls.code.setErrors({duplicate: true});
                } else {
                    this.form.controls.code.setErrors(null);
                }
                this.cdr.detectChanges();
            },
            e => {
                this.toastr.error(e.getMessage(), ERROR_TITLE);
            }
        );
    }

    unitChange(clear: boolean = true) {
        if (clear) {
            this.form.controls.pmo.setValue('');
        }
        if (this.form.controls.unit.value) {
            this.pmos.next(this.pmosAll.filter(u => u.unitCode === this.form.controls.unit.value && (u.authorities[0] === 'ROLE_LEADER_SPECIAL' || u.authorities[0] === 'ROLE_LEADER')));
        }
    }

    areaChange(clear: boolean = true) {
        if (clear) {
            this.form.controls.province.setValue('');
            this.form.controls.district.setValue('');
        }
        if (this.form.controls.area.value) {
            this.provinces.next(this.cache.getSession<RegionDTO[]>(PROVINCE_LIST)
                .filter(p => p.regionCode === this.form.controls.area.value));
        } else {
            this.provinces.next([]);
        }

        if (this.form.controls.area.value === 'TW') {
            this.form.controls.district.clearValidators();
        } else {
            this.form.controls.district.setValidators([Validators.required]);
        }
        this.form.controls.district.updateValueAndValidity();
    }

    provinceChange(clear: boolean = true) {
        if (clear) {
            this.form.controls.district.setValue('');
        }
        if (this.form.controls.province.value) {
            this.districts.next(this.cache.getSession<RegionDTO[]>(DISTRICT_LIST)
                .filter(p => p.provinceCode === this.form.controls.province.value));
        } else {
            this.districts.next([]);
        }
    }

    previousState(): void {
        window.history.back();
    }


}
