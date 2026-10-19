export class AuditResponse {
    id: number;
    auditor: string;
    dateCreate: string;
    location: string;
    note: string;
    status: string;
    constructor(id: number, auditor: string, dateCreate: string, location: string, note: string, status: string) {
        this.id = id;
        this.auditor = auditor;
        this.dateCreate = dateCreate;
        this.location = location;
        this.note = note;
        this.status = status;
    }
}