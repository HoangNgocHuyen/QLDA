import {Component, OnInit} from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {NotificationService} from './notification.service';
import {ResDTO} from '../../share/dto/ResDTO';
import {UserModel} from '../../modules/auth/_models/user.model';
import {ShareService} from '../../share/share.service';
import {ResponseObject} from '../../share/models/response-obj.model';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {UnitDTO} from '../../share/dto/UnitDTO';
import {TargetGroupService} from '../category/target-group/target-group.service';
import {Notification} from '../../share/models/Notification';
import {SelectBoxDTO} from '../../share/dto/SelectBoxDTO';
import {SUCCESS_CODE} from '../../share/constants/input.constants';
import {TaskDTO} from "../../share/dto/TaskDTO";

type SelectableEntity = UserModel;

@Component({
    selector: 'notification-update',
    templateUrl: './notification-update.component.html',
})
export class NotificationUpdateComponent implements OnInit {

    Projects = new BehaviorSubject<SelectBoxDTO[]>([]);
    Units = new BehaviorSubject<UnitDTO[]>([]);
    Tasks = new BehaviorSubject<TaskDTO[]>([]);
    notification: Notification;
    isSaving = false;
    showUsername = false;
    showListUsername = false;
    showProject = false;
    showTask = false;
    showUnit = false;
    editForm: FormGroup;

    constructor(
        public service: NotificationService,
        private toastService: ToastrService,
        private translateService: TranslateService,
        public serviceShare: ShareService,
        protected activatedRoute: ActivatedRoute,
        private targetGroupService: TargetGroupService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({notification}) => {
            this.notification = notification;
        });
        this.initForm();
        this.loadProject();
        this.loadUnit();
        this.loadTask();
    }

    initForm() {
        this.editForm = this.fb.group({
            id: new FormControl(null),
            title: new FormControl('', [
                Validators.required
            ]),
            message: new FormControl('', [
                Validators.required
            ]),
            projectCode: new FormControl(''),
            unitCode: new FormControl(''),
            taskCode: new FormControl(''),
            username: new FormControl(''),
            listUsername: new FormControl(''),
            type: new FormControl('', [
                Validators.required
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
        const notify = this.editForm.value;
        if (notify.id !== undefined && notify.id != null) {
            this.subscribeToSaveResponse(this.service.update(notify));
        } else {
            this.subscribeToSaveResponse(this.service.create(notify));
        }
        this.isSaving = false;
    }

    protected subscribeToSaveResponse(result: Observable<ResDTO<Notification>>): void {
        result.subscribe(
            (res) => this.onSaveSuccess(res),
            (err) => this.onSaveError(err)
        );
    }

    protected onSaveSuccess(res: ResponseObject<any>): void {
        if (res.code === '00') {
            if (this.notification.id == null) {
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

    loadProject() {
        this.serviceShare.getProject().subscribe(
            res => {
                if (res.code === SUCCESS_CODE) {
                    this.Projects.next(res.data);
                }
            }
        );
    }

    loadUnit() {
        this.serviceShare.getUnits().subscribe(
            res => this.Units.next(res)
        );
    }

    loadTask() {
        this.serviceShare.getTasks().subscribe(
            res => this.Tasks.next(res)
        );
    }

    trackById(index: number, item: SelectableEntity): any {
        return item.id;
    }
    typeChange() {
        const type = this.editForm.controls.type.value;
        if (type == null) {
            this.toastService.error('Loại thông báo chưa gán được giá trị');
        }
        this.showUsername = false;
        this.showListUsername = false;
        this.showProject = false;
        this.showUnit = false;
        this.showTask = false;
        switch (type) {
            case 'USER':
                this.showUsername = true;
                break;
            case 'LIST_USER':
                this.showListUsername = true;
                break;
            case 'PROJECT':
                this.showProject = true;
                break;
            case 'UNIT':
                this.showUnit = true;
                break;
            case 'TASK':
                this.showTask = true;
                break;
        }
    }
}
