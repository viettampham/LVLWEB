export class GetAuditDetail{
    pageIndex: number;
    pageSize: number;
    assignee: string;
    fromDate: string;
    toDate: string;
    status: string;

    constructor(pageIndex: number, pageSize: number, assignee: string,fromDate: string,toDate: string, status: string){
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.assignee = assignee;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.status = status
        
    }

}