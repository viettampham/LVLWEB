export class CreateAuditRequest {
  location: string;
  auditor: string;
  note: string;

  constructor(location: string, auditor: string, note: string) {
    this.location = location;
    this.auditor = auditor;
    this.note = note;
  }
}   