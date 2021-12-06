

export class TargetGroup {
    constructor(
        public id?: number,
        public projectId?: number,
        public code?: string,
        public name?: string,
        public description?: string,
        public createdAt?: string | null,
        public createdBy?: string | null,
        public updatedAt?: string | null,
        public updatedBy?: string | null,
        public selected: boolean = false,
    ) {
    }
}
