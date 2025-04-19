export type Pageable<SubType> = {
    content: SubType[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    },
    numberOfElements: number;
    pageable: {
        offset: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        },
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
    },
    first: boolean;
    last: boolean;
    empty: boolean;
}