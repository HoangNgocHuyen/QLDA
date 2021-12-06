import {Component, OnInit} from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {TargetService} from './target.service';
import {Target} from '../../share/models/target';
import {ResDTO} from '../../share/dto/ResDTO';
import {UserModel} from '../../modules/auth/_models/user.model';
import {ShareService} from '../../share/share.service';
import {ResponseObject} from '../../share/models/response-obj.model';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {ProjectTargetGroup} from '../../share/dto/ProjectTargetGroup';
import {UnitDTO} from '../../share/dto/UnitDTO';
import {TargetGroupService} from '../category/target-group/target-group.service';

type SelectableEntity = UserModel;

@Component({
    selector: 'target-update',
    templateUrl: './target-update.component.html',
})
export class TargetUpdateComponent implements OnInit {

    Groups = new BehaviorSubject<ProjectTargetGroup[]>([]);
    Units = new BehaviorSubject<UnitDTO[]>([]);
    target: Target;
    isSaving = false;
    projectCode: string;
    projectName: string;
    unitCode: string;
    editForm: FormGroup;

    constructor(
        public service: TargetService,
        private toastService: ToastrService,
        private translateService: TranslateService,
        public serviceShare: ShareService,
        protected activatedRoute: ActivatedRoute,
        private targetGroupService: TargetGroupService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({target}) => {
            this.target = target;
            this.projectCode = target.projectCode;
        });
        if (this.projectCode === null || this.projectCode === undefined) {
            this.activatedRoute.queryParams.subscribe((param) => {
                this.projectCode = param.projectCode;
                this.projectName = param.projectName;
            });
        }
        this.initForm();
        this.loadTargetGroup();
        this.loadUnit();
        if (this.target.id === null || this.target.id === undefined) {
            this.editForm.controls.projectCode.setValue(this.projectCode);
            this.editForm.controls.projectName.setValue(this.projectName);
        }
    }

    initForm() {
        this.editForm = this.fb.group({
            projectName: new FormControl(this.target.projectName),
            id: new FormControl(this.target.id),
            code: new FormControl(this.target.code, [
                Validators.required,
                Validators.pattern('^[0-9a-zA-Z_]{3,20}')
            ]),
            title: new FormControl(this.target.title, [
                Validators.required
            ]),
            projectCode: new FormControl(this.target.projectCode, [
                Validators.required
            ]),
            groupCode: new FormControl(this.target.groupCode, [
                Validators.required
            ]),
            unitCode: new FormControl(this.target.unitCode, [
                Validators.required
            ]),
            startTime: new FormControl(this.target.startTime, [
                Validators.required
            ]),
            endTime: new FormControl(this.target.endTime, [
                Validators.required
            ]),
            status: new FormControl(this.target.status == null ? 'OPEN' : this.target.status, [
                Validators.required
            ]),
            description: new FormControl(this.target.description),
            numberDay: new FormControl(this.target.numberDay == null ? 1 : this.target.numberDay, [
                Validators.required,
                Validators.pattern('^[0-9]{1,3}$'),
                Validators.min(1)
            ]),
            numberMeeting: new FormControl(this.target.numberMeeting == null ? 1 : this.target.numberMeeting, [
                Validators.required,
                Validators.pattern('^[0-9]{1,3}$'),
                Validators.min(1)
            ]),
            numberDayWorking: new FormControl(this.target.numberDayWorking == null ? 1 : this.target.numberDayWorking, [
                Validators.required,
                Validators.pattern('^[0-9]{1,3}$'),
                Validators.min(1)
            ]),
            donePercent: new FormControl(this.target.donePercent == null ? 0 : this.target.donePercent, [
                Validators.required,
                Validators.pattern('^[0-9]{1,3}$'),
                Validators.min(0)
            ]),
        });
    }

    get frm() {
        if (this.editForm !== undefined) {
            return this.editForm.controls;
        }
    }

    previousState(): void {
        window.history.back();
    }

    save(): void {
        this.isSaving = true;
        const target = this.editForm.value;
        if (target.id !== undefined && target.id != null) {
            this.subscribeToSaveResponse(this.service.update(target));
        } else {
            this.subscribeToSaveResponse(this.service.create(target));
        }
    }

    protected subscribeToSaveResponse(result: Observable<ResDTO<Target>>): void {
        result.subscribe(
            (res) => this.onSaveSuccess(res),
            (err) => this.onSaveError(err)
        );
    }

    protected onSaveSuccess(res: ResponseObject<any>): void {
        if (res.code === '00') {
            if (this.target.id == null) {
                this.toastService.success('Tạo mới thành công');
            } else {
                this.toastService.success('Cập nhật thành công');
            }
            this.isSaving = false;
            this.previousState();
        } else {
            this.toastService.error(res.desc);
            this.isSaving = false;
        }
    }

    protected onSaveError(error): void {
        this.toastService.error(this.translateService.instant('message.error'));
        this.isSaving = false;
    }

    loadTargetGroup() {
        this.targetGroupService.projectTargetGroupByProject(this.projectCode).subscribe(
            res => this.Groups.next(res)
        );
    }

    loadUnit() {
        this.serviceShare.unitByProjectCode(this.projectCode).subscribe(
            res => this.Units.next(res)
        );
    }

    trackById(index: number, item: SelectableEntity): any {
        return item.id;
    }
}
