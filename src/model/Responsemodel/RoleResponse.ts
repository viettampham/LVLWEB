export class RoleResponse{
    id: number;
    roleLevel: string;
    roleName: string;

    constructor(id: number, roleLevel: string, roleName: string){
        this.id = id;
        this.roleLevel = roleLevel;
        this.roleName = roleName;
    }
}