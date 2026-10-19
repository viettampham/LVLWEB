export class AuditDetailResponse{
    id: number;
    auditId: number;
    operationStandard: string;
    detechIssue: string;
    imageBefore: string;
    imageAfter: string;
    assignee: string;
    dueDate: string;
    status: string;
    note: string;
    evalue: string;

    constructor(id: number, auditId: number, operationStandard: string, detechIssue: string, imageBefore: string, imageAfter: string, assignee:string, dueDate:string, status:string, note: string, evalue:string) {
        this.id = id;
        this.auditId = auditId;
        this.operationStandard = operationStandard;
        this.detechIssue = detechIssue;
        this.imageAfter = imageAfter;
        this.imageBefore = imageBefore;
        this.assignee = assignee;
        this.dueDate = dueDate;
        this.status = status;
        this.note = note;
        this.evalue = evalue
    }
}