export class Target {
    projectName: string;
    projectCode: string;
    projectId: number;
    groupName: string;
    groupCode: string;
    groupId: number;
    code: string;
    title: string;
    closedAt: Date;
    closedBy: string;
    createdAt: Date;
    createdBy: string;
    description: string;
    donePercent: number;
    endTime: Date;
    id: number;
    numberDay: number;
    numberDayWorking: number;
    unitName: string;
    unitCode: string;
    startTime: Date;
    status: string;
    numberMeeting: number;
    errors: Target;
}


export class TargetSearch {
    projectCode: string;
    groupCode: string;
    unitCode: string;
    code: string;
    title: string;
    status: string;
    startTime: Date;
    endTime: Date;
}
