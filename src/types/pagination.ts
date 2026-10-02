// types/pagination.ts

export interface SpringPage<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: SpringSort;
  };
  sort: SpringSort;
}

interface SpringSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}