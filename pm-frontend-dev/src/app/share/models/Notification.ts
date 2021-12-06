export class Notification {
    constructor(
        public id?: number,
        public title?: string,
        public message?: string | null,
        public projectCode?: number | null,
        public unitCode?: string | null,
        public taskCode?: string | null,
        public username?: string | null,
        public listUsername?: string | null,
        public type?: string,
        public status?: string,
        public createdDate?: string | null,
        public createdBy?: string | null
    ) {
    }
}

export class NotificationSearch {
    type: string;
    title: string;
    status: string;
    startTime: Date;
    endTime: Date;
}
