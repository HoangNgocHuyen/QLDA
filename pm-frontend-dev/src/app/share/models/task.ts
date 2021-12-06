import {UserModel} from '../../modules/auth/_models/user.model';

export class Task {
    id: string;
    startTime: string;
    endTime: string;
    estimatedTime: string;
    spentTime: string;
    priority: string;
    status: string;
    donePercent: string;
    createdBy: string;
    chairedMeeting: string;
    code: string;
    createdDate: string;
    dateMeeting: string;
    device: string;
    document: string;
    endDate: string;
    image: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    name: string;
    note: string;
    projectCode: string;
    reason: string;
    report: string;
    secretary: string;
    startDate: string;
    targetCode: string;
    taskParentCode: string;
    type: string;
    video: string;
    taskUsers: UserModel[];
    taskConfirms: ConfirmTaskDTO[];

}

export class ConfirmTaskDTO {
    id: number;
    objectConfirm: string;
    objectConfirmName: string;
    taskId: number;
    status: string;
    reason: string;
}
