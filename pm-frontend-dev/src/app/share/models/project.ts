export class Project {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string | null,
        public pmoUser?: number | null,
        public area?: string | null,
        public province?: string | null,
        public district?: string | null,
        public unit?: string,
        public startDate?: string,
        public endDate?: string,
        public status?: ProjectStatusEnum,
        public note?: string | null,
        public createdAt?: string | null,
        public createdBy?: string | null,
        public updatedAt?: string | null,
        public updatedBy?: string | null,
        public pmoName?: string | null,
        public areaName?: string | null,
        public provinceName?: string | null,
        public districtName?: string | null
    ) {
    }
}

export enum ProjectStatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}
