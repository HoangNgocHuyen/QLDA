export class ScheduleDTO {
    assigneeId: number;
    taskId: number;
    assignee: string;
    closedAt: Date;
    closedBy: string;
    createdAt: Date;
    createdBy: string;
    description: string;
    donePercent: number;
    endTime: Date;
    estimatedTime: number;
    id: number;
    priority: string;
    spentTime: number;
    startTime: Date;
    status: string;
    title: string;
    address: string;
    method: string;
    role: string;
    document: string;
    reportDoc: string;
    secretaryId: number;
    ownerId: number;
}

export class ScheduleSearchDTO {
    assigneeId: string;
    taskId: string;
    priority: string;
    status: string;
    title: string;
}
