export class TaskDTO {

    id?: string;
    code?: string;
    name?: string;
    type?: string;
    projectCode?: string;
    targetCode?: string;
    taskParentCode?: string;
    status?: string;
    taskUsers?: any[];
    taskConfirms?: any[];
    startDate?: string;
    endDate?: string;
    note?: string;
    reason?: string;
    estimatedTime?: string;
    spentTime?: string;
    priority?: string;
    donePercent?: string;
    startTime?: string;
    endTime?: string;
    dateMeeting?: string;
    location?: string;
    programme?: string;
    document?: string;
    device?: string;
    chairedMeeting?: string;
    secretary?: string;
    reportMeeting?: string;
    image?: string;
    video?: string;

    userName: string;
    fullName: number;
    position: string;
    unit: string;
    detail: boolean;
}


export class TaskSearchDTO {
    projectCode: string;
    targetCode: string;
    code: string;
    name: string;
    parentCode: string;
    type: string;
    startDate: Date;
    endDate: Date;
    userId: number;
}

export class TaskUserDTO {
    id?: number;
    userId?: number;
    username?: string;
    fullName?: string;
    taskId?: number;
}

export class TaskConfirmDTO {
    id?: number;
    objectConfirm?: string;
    objectConfirmName?: string;
    taskId?: number;
    status?: string;
    reason?: string;
    files?: string[];
}
