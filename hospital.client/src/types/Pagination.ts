export interface PaginationParms {
    pageNumber: number,
    pageSize: number
}

export interface PaginationResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}