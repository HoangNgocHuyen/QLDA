import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {TaskService} from './task.service';
import {ResDTO} from '../../share/dto/ResDTO';
import {TaskConfirmDTO, TaskDTO} from '../../share/dto/TaskDTO';
import {ShareService} from '../../share/share.service';
import {ResponseObject} from '../../share/models/response-obj.model';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs/operators';
import {UserModel} from '../../modules/auth/_models/user.model';
import {SUCCESS_CODE} from '../../share/constants/input.constants';
import {SelectBoxDTO} from '../../share/dto/SelectBoxDTO';
import {BucketNameEnums} from '../../share/constants/bucket-name.enums';
import {SpinnerServiceExt} from '../../share/spinner-service-ext';
import {ProjectService} from '../project/project.service';

@Component({
    selector: 'task-update',
    templateUrl: './task-update.component.html',
})
export class TaskUpdateComponent implements OnInit, OnDestroy {

    task: TaskDTO;
    usersRaw: UserModel[] = [];
    users: BehaviorSubject<UserModel[]> = new BehaviorSubject<UserModel[]>([]);
    projects: BehaviorSubject<SelectBoxDTO[]> = new BehaviorSubject<SelectBoxDTO[]>([]);
    targetsRaw: SelectBoxDTO[] = [];
    targets: BehaviorSubject<SelectBoxDTO[]> = new BehaviorSubject<SelectBoxDTO[]>([]);
    taskParentsRaw: TaskDTO[] = [];
    taskParents: BehaviorSubject<TaskDTO[]> = new BehaviorSubject<TaskDTO[]>([]);
    bucketNameEnums = BucketNameEnums;
    editForm: FormGroup;
    submitProcessing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        public service: TaskService,
        private toastService: ToastrService,
        private translateService: TranslateService,
        public serviceShare: ShareService,
        protected activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private spinner: SpinnerServiceExt,
        private projectService: ProjectService,
    ) {
        this.activatedRoute.data.subscribe(({task}) => {
            this.task = task;
            if (task.id) {
                this.getUserProject(task.projectCode);
            }
        });
    }

    ngOnInit(): void {
        this.initForm();
        this.spinner.show('ngOnInit');
        combineLatest([
            this.serviceShare.getProject(),
            this.serviceShare.getTarget(),
            this.serviceShare.getTasks(),
        ]).subscribe(([projects, targets, tasks]) => {
            if (projects.code === SUCCESS_CODE) {
                this.projects.next(projects.data);
            }
            if (targets.code === SUCCESS_CODE) {
                this.targetsRaw = targets.data;
            }
            this.taskParentsRaw = tasks;
            this.filterDataTargets(this.task.projectCode);
            this.filterDataParentTasks(this.task.projectCode, this.task.targetCode);
            this.spinner.hide('ngOnInit');
        });
    }

    initForm() {
        this.editForm = this.fb.group({
            id: new FormControl(this.task.id),
            projectCode: new FormControl(this.task.projectCode, [Validators.required]),
            targetCode: new FormControl(this.task.targetCode, [Validators.required]),
            type: new FormControl(this.task.type ? this.task.type : 'WORK', [Validators.required]),
            taskParentCode: new FormControl(this.task.taskParentCode),
            code: new FormControl(this.task.code, [
                Validators.required,
                Validators.maxLength(255),
                Validators.pattern('')
            ]),
            name: new FormControl(this.task.name, [
                Validators.required,
                Validators.maxLength(255),
            ]),
            status: new FormControl(this.task.status ? this.task.status : 'OPEN', [Validators.required]),
            reason: new FormControl(this.task.reason, [
                Validators.maxLength(255)
            ]),
            startDate: new FormControl(this.task.startDate, [Validators.required]),
            endDate: new FormControl(this.task.endDate, [Validators.required]),
            startTime: new FormControl(this.task.startTime ? new Date(this.task.startTime) : null),
            endTime: new FormControl(this.task.endTime ? new Date(this.task.endTime) : null),
            dateMeeting: new FormControl(this.task.dateMeeting),
            location: new FormControl(this.task.location),
            programme: new FormControl(this.task.programme),
            document: new FormControl(this.task.document),
            device: new FormControl(this.task.device),
            chairedMeeting: new FormControl(this.task.chairedMeeting),
            secretary: new FormControl(this.task.secretary),
            reportMeeting: new FormControl(this.task.reportMeeting),
            image: new FormControl(this.task.image),
            video: new FormControl(this.task.video),
            note: new FormControl(this.task.note, Validators.maxLength(255)),
            percent: new FormControl(this.task.donePercent ? this.task.donePercent : 0, Validators.required),
            taskUsers: this.fb.array([]),
            taskConfirms: this.fb.array([]),
        });
        this.verifyDataTaskConfirms();
        this.verifyDataTaskUsers();
        this.updateValidator(this.task.type ? this.task.type : 'WORK');
        this.frm.projectCode.valueChanges.subscribe(value => {
            this.filterDataTargets(value);
            this.getUserProject(value);
            this.frm.targetCode.setValue(null);
        });
        this.frm.targetCode.valueChanges.subscribe(value => {
            this.filterDataParentTasks(this.frm.projectCode.value, value);
            this.filterDataUser(value);
            this.frm.taskParentCode.setValue(null);
        });
        this.frm.type.valueChanges.subscribe(value => this.updateValidator(value));
    }

    updateValidator(type: string) {
        if (type === 'WORK') {
            this.frm.startDate.setValidators(Validators.required);
            this.frm.endDate.setValidators(Validators.required);
            this.frm.startTime.setValidators([]);
            this.frm.endTime.setValidators([]);
            this.frm.dateMeeting.setValidators([]);
            this.frm.location.setValidators([]);
            this.frm.programme.setValidators([]);
            this.frm.document.setValidators([]);
            this.frm.device.setValidators([]);
            this.frm.chairedMeeting.setValidators([]);
            this.frm.secretary.setValidators([]);
        } else {
            this.frm.startDate.setValidators([]);
            this.frm.endDate.setValidators([]);
            this.frm.startTime.setValidators(Validators.required);
            this.frm.endTime.setValidators(Validators.required);
            this.frm.dateMeeting.setValidators(Validators.required);
            this.frm.location.setValidators([
                Validators.required,
                Validators.maxLength(255),
            ]);
            this.frm.programme.setValidators([
                Validators.required,
                Validators.maxLength(255),
            ]);
            this.frm.document.setValidators(Validators.required);
            this.frm.device.setValidators([
                Validators.required,
                Validators.maxLength(255),
            ]);
            this.frm.chairedMeeting.setValidators([
                Validators.required,
                Validators.maxLength(255),
            ]);
            this.frm.secretary.setValidators([
                Validators.required,
                Validators.maxLength(255),
            ]);
        }
        this.frm.startDate.updateValueAndValidity();
        this.frm.endDate.updateValueAndValidity();
        this.frm.startTime.updateValueAndValidity();
        this.frm.endTime.updateValueAndValidity();
        this.frm.dateMeeting.updateValueAndValidity();
        this.frm.location.updateValueAndValidity();
        this.frm.programme.updateValueAndValidity();
        this.frm.document.updateValueAndValidity();
        this.frm.device.updateValueAndValidity();
        this.frm.chairedMeeting.updateValueAndValidity();
        this.frm.secretary.updateValueAndValidity();
    }

    filterDataTargets(projectCode) {
        let item = this.projects.getValue().filter(t => {
            return t.code === projectCode;
        });
        let data = this.targetsRaw.filter(t => {
            if (item && item.length > 0) {
                return t.projectId === item[0].id;
            }
            return t;
        });
        this.targets.next(data);
    }

    filterDataParentTasks(projectCode, targetCode) {
        let item = this.taskParentsRaw.filter(t => {
            return t.projectCode === projectCode && t.targetCode === targetCode;
        });
        this.taskParents.next(item);
    }

    filterDataUser(targetCode: string) {
        let userExits = [];
        this.frmTaskUsers.value.forEach(t => {
            userExits.push(t.username);
        });
        const item = this.targets.getValue().filter(t => {
            return t.code === targetCode;
        });
        let data = this.usersRaw.filter(t => {
            return !userExits.includes(t.login) && t.unitCode === item[0].unitCode;
        });
        console.log(userExits, data, this.usersRaw);
        this.users.next(data);
    }

    getUserProject(projectCode: string) {
        this.projectService.findSelectedProjectUser(projectCode).subscribe(res => {
            this.usersRaw = res;
        });
    }

    get frm() {
        if (this.editForm !== undefined) {
            return this.editForm.controls;
        }
    }

    //<editor-fold desc="Form Array TaskConfirm">
    get frmTaskConfirm(): FormArray {
        return this.editForm.controls['taskConfirms'] as FormArray;
    }

    verifyDataTaskConfirms() {
        if (!this.task.id || !this.task.taskConfirms || this.task.taskConfirms.length <= 0) {
            this.service.confirmObjectDefault.forEach(t => {
                this.addTaskConfirms(t.id, t.objectConfirm, t.objectConfirmName, t.status, t.reason, []);
            });
        } else if (this.task.taskConfirms && this.task.taskConfirms.length > 0) {
            this.task.taskConfirms.forEach(t => {
                this.addTaskConfirms(t.id, t.objectConfirm, t.objectConfirmName, t.status, t.reason, t.files);
            });
        }
    }

    addTaskConfirms(id: number, objectConfirm: string, objectConfirmName: string, status: string, reason: string, files: string[]) {
        this.frmTaskConfirm.push(this.fb.group(
            {
                id: [id],
                objectConfirm: [objectConfirm, Validators.required],
                objectConfirmName: [objectConfirmName, Validators.required],
                taskId: [this.task.id ? this.task.id : null],
                status: [status, Validators.required],
                reason: [reason, Validators.maxLength(255)],
                files: [files]
            }
        ));
        this.cdr.detectChanges();
    }

    //</editor-fold>

    //<editor-fold desc="Form Array TaskUsers">
    get frmTaskUsers(): FormArray {
        return this.editForm.controls['taskUsers'] as FormArray;
    }

    verifyDataTaskUsers() {
        if (this.task.taskUsers && this.task.taskUsers.length > 0) {
            this.task.taskUsers.forEach(t => {
                this.frmTaskUsers.push(this.fb.group(
                    {
                        id: [t.id],
                        userId: [t.userId, Validators.required],
                        username: [t.username, Validators.required],
                        fullName: [t.fullName, Validators.required],
                        taskId: [t.id]
                    }
                ));
                this.cdr.detectChanges();
            });
        }
    }

    addTaskNewUser() {
        this.frmTaskUsers.push(this.fb.group(
            {
                id: [null],
                userId: [null, Validators.required],
                username: [null, Validators.required],
                fullName: [null, Validators.required],
                taskId: [this.task.id ? this.task.id : null]
            }
        ));
        this.cdr.detectChanges();
    }

    addNewUserChange(_event, index) {
        this.frmTaskUsers.controls[index].setValue({
            id: null,
            userId: _event.id,
            username: _event.login,
            fullName: _event.fullName,
            taskId: this.task.id ? this.task.id : null
        });
        this.filterDataUser(this.editForm.value.targetCode);
    }

    deleteUser(index) {
        this.frmTaskUsers.removeAt(index);
    }

    //</editor-fold>

    previousState(): void {
        window.history.back();
    }

    save(): void {
        this.submitProcessing.next(true);
        const task = this.editForm.value;
        if (task.id !== undefined && task.id != null) {
            this.subscribeToSaveResponse(this.service.update(task));
        } else {
            this.subscribeToSaveResponse(this.service.create(task));
        }
    }

    protected subscribeToSaveResponse(result: Observable<ResDTO<TaskDTO>>): void {
        result
            .pipe(finalize(() => this.submitProcessing.next(false)))
            .subscribe(
                (res) => this.onSaveSuccess(res),
                (err) => this.onSaveError(err)
            );
    }

    protected onSaveSuccess(res: ResponseObject<any>): void {
        if (res.code === '00') {
            if (this.task.id == null) {
                this.toastService.success('Tạo mới công việc thành công');
            } else {
                this.toastService.success('Cập nhật công việc thành công');
            }
            this.previousState();
        } else {
            this.toastService.error(res.desc);
        }
    }

    protected onSaveError(error): void {
        this.toastService.error(this.translateService.instant('message.error'));
        this.submitProcessing.next(false);
    }

    uploadFile(file: any, bucketName: string) {
        let formData = new FormData();
        formData.append('file', file);
        formData.append('bucketName', bucketName);
        return this.serviceShare.uploadFile(formData);
    }

    deleteFile(path: string) {
        return this.serviceShare.deleteFile(path);
    }

    async onChangeUploadReason(_event: any, item: TaskConfirmDTO, index: any) {
        this.uploadFile(_event.target.files[0], this.bucketNameEnums.BUCKET_REASON).then(res => {
            if (res.code === SUCCESS_CODE) {
                let value = item.files;
                if (value && value.length > 0) {
                    value.push(res.data);
                } else {
                    value = [res.data];
                }
                this.frmTaskConfirm.controls[index].get('files').setValue(value);
                this.cdr.detectChanges();
            }
        });
    }

    onClearUploadReason(path: string, item: TaskConfirmDTO, index: any) {
        let value = item.files.filter(t => {
            return t !== path;
        });
        this.frmTaskConfirm.controls[index].get('files').setValue(value);
        this.cdr.detectChanges();
    }

    onChangeUploadFile(_event: any, formControlName: string, bucketName: string) {
        this.uploadFile(_event.target.files[0], bucketName).then(res => {
            if (res.code === SUCCESS_CODE) {
                let value = this.editForm.controls[formControlName].value;
                if (value && value.length > 0) {
                    value.push(res.data);
                } else {
                    value = [res.data];
                }
                this.editForm.controls[formControlName].setValue(value);
                this.cdr.detectChanges();
            }
        });
    }

    onClearUploadFile(path: string, formControlName: string) {
        let value = this.editForm.controls[formControlName].value.filter(t => {
            return t !== path;
        });
        this.editForm.controls[formControlName].setValue(value);
        this.cdr.detectChanges();
    }

    ngOnDestroy(): void {
        this.targets.complete();
        this.projects.complete();
        this.users.complete();
        this.submitProcessing.complete();
    }
}
