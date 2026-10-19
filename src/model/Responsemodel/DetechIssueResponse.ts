export class DetechIssueResponse {
    id: number;
    idOperationStandard: number;
    codeIssue: string;
    detechIssue1: string;
    type: string;
    constructor(id: number, idOperationStandard: number, codeIssue: string, detechIssue1: string, type: string) {
        this.id = id;
        this.idOperationStandard = idOperationStandard;
        this.codeIssue = codeIssue;
        this.detechIssue1 = detechIssue1;
        this.type = type;
    }
}