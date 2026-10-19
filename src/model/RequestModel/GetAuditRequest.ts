export class GetAuditRequest {
    pageIndex: number;
    pageSize: number;
    location: string;
    auditor: string;
    dateCreateFrom: string;
    dateCreateTo: string;

    constructor(pageIndex: number, pageSize: number, location: string, auditor: string, dateCreateFrom: string, dateCreateTo: string) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.location = location;
        this.auditor = auditor;
        this.dateCreateFrom = dateCreateFrom;
        this.dateCreateTo = dateCreateTo;
    }
}