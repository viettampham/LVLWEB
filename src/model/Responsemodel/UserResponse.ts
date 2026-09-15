import { SearchUserModel } from '../RequestModel/SearchUserModel';

export class UserResponse {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
  avatar: string;
  dateOfBirth: string;
  gender: string;
  status: string;
  lastLoginAt: string;
  failedLoginAttempts: number;
  lockedUntil: string;
  roleLevel: number;
  createAt: string;
  createBy: string;
  editAt: string;
  editBy: string;
  deleteAt: string;
  deleteBy: string;
  cccd: string;
  phongBan: string;

  constructor(
    id: number,
    fullName: string,
    userName: string,
    email: string,
    phoneNumber: string,
    address: string,
    avatar: string,
    dateOfBirth: string,
    gender: string,
    status: string,
    lastLoginAt: string,
    failedLoginAttempts: number,
    lockedUntil: string,
    roleLevel: number,
    createAt: string,
    createBy: string,
    editAt: string,
    editBy: string,
    deleteAt: string,
    deleteBy: string,
    cccd: string,
    phongBan: string,
  ) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.avatar = avatar;
    this.userName = userName;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.status = status;
    this.lastLoginAt = lastLoginAt;
    this.failedLoginAttempts = failedLoginAttempts;
    this.lockedUntil = lockedUntil;
    this.roleLevel = roleLevel;
    this.createAt = createAt;
    this.createBy = createBy;
    this.editAt = createBy;
    this.editBy = createBy;
    this.deleteAt = deleteAt;
    this.deleteBy = deleteBy;
    this.cccd = cccd;
    this.phongBan = phongBan;
  }
}
