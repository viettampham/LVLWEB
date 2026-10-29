export class UpdateUserRequest{
    id: number;
    fullName: string;
    userName:string;
    email: string;
    phoneNumber: string;
    address: string;
    avatar: string;
    dateOfBirth: string;
    gender: string;
    cccd: string;
    phongBan: string;
    trangThai: string;
    roleLevel: number;
    constructor(id: number, fullName: string, userName: string, email: string, 
        phoneNumber: string, address: string, avatar:string, dateOfBirth: string,
        gender: string, cccd: string, phongBan: string, trangthai: string, roleLevel: number){
            this.id = id;
            this.fullName = fullName;
            this.userName = userName;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.address = address;
            this.avatar = avatar;
            this.dateOfBirth = dateOfBirth;
            this.gender = gender;
            this.cccd = cccd;
            this.phongBan = phongBan;
            this.trangThai = trangthai;
            this.roleLevel = roleLevel;
        }
}