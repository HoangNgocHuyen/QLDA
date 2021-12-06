import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TaskDTO} from '../../share/dto/TaskDTO';
import {UserModel} from '../../modules/auth/_models/user.model';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {SelectBoxDTO} from '../../share/dto/SelectBoxDTO';
import {BucketNameEnums} from '../../share/constants/bucket-name.enums';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TaskService} from './task.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {ShareService} from '../../share/share.service';
import {ActivatedRoute} from '@angular/router';
import {SpinnerServiceExt} from '../../share/spinner-service-ext';
import {SUCCESS_CODE} from '../../share/constants/input.constants';

@Component({
    selector: 'task-detail',
    templateUrl: './task-detail.component.html',
})
export class TaskDetailComponent implements OnInit {

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
    ) {
        this.activatedRoute.data.subscribe(({task}) => {
            this.task = task;
        });
    }

    ngOnInit(): void {
        this.initForm();
        this.spinner.show('ngOnInit');
        combineLatest([
            this.serviceShare.getAllUsers(),
            this.serviceShare.getProject(),
            this.serviceShare.getTarget(),
            this.serviceShare.getTasks(),
        ]).subscribe(([users, projects, targets, tasks]) => {
            this.usersRaw = users;
            if (projects.code === SUCCESS_CODE) {
                this.projects.next(projects.data);
            }
            if (targets.code === SUCCESS_CODE) {
                this.targetsRaw = targets.data;
            }
            this.taskParentsRaw = tasks;
            this.filterDataUser();
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
        this.frm.projectCode.valueChanges.subscribe(value => {
            this.filterDataTargets(value);
            this.frm.targetCode.setValue(null);
        });
        this.frm.targetCode.valueChanges.subscribe(value => {
            this.filterDataParentTasks(this.frm.projectCode.value, value);
            this.frm.taskParentCode.setValue(null);
        });
    }

    filterDataUser() {
        let userExits = [];
        this.frmTaskUsers.value.forEach(t => {
            userExits.push(t.username);
        });
        const data = this.usersRaw.filter(t => {
            return !userExits.includes(t.login);
        });
        this.users.next(data);
    }

    filterDataTargets(projectCode) {
        let item = this.projects.getValue().filter(t => {
            return t.code === projectCode;
        });
        let data = this.targetsRaw.filter(t => {
            return t.projectId === item[0].id;
        });
        this.targets.next(data);
    }

    filterDataParentTasks(projectCode, targetCode) {
        let item = this.taskParentsRaw.filter(t => {
            return t.projectCode === projectCode && t.targetCode === targetCode;
        });
        this.taskParents.next(item);
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

    //</editor-fold>

    previousState(): void {
        window.history.back();
    }

    ngOnDestroy(): void {
        this.targets.complete();
        this.projects.complete();
        this.users.complete();
        this.submitProcessing.complete();
    }
}
