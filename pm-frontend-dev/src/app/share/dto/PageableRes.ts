export class PageableRes<T> {
    totalPages: number;
    totalElements: number;
    size: number;
    content: T[];

}
