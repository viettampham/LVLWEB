export class DepartmentResponse{
    id: number;
    departmentName: string;
    note: string;
    constructor(id: number,departmentName: string, note: string){
        this.id = id;
        this.departmentName = departmentName;
        this.note = note;
    }
}