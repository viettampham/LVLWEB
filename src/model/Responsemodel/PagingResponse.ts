export class PagingResponse<T> {
  totalRecords: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;

  constructor(totalRecords: number, pageIndex: number, pageSize: number, totalPages: number) {
    this.totalRecords = totalRecords;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.totalPages = totalPages;
  }
}
