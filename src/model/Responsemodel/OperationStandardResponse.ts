export class OperationStandardResponse {
    id: number;
    operationStandard1: string;
    note: string;

    constructor(id: number, operationStandard1: string, note: string) {
        this.id = id;
        this.operationStandard1 = operationStandard1;
        this.note = note;
    }
}