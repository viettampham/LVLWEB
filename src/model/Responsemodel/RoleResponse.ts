export class RoleResponse{
    id: number;
    roleLevel: string;
    roleName: string;
    note: string;

    constructor(id: number, roleLevel: string, roleName: string, note: string){
        this.id = id;
        this.roleLevel = roleLevel;
        this.roleName = roleName;
        this.note = note;
    }
}