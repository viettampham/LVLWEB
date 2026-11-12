import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonResponseModal } from '../../model/Responsemodel/CommonResponseModal';
import { SearchUserModel } from '../../model/RequestModel/SearchUserModel';
import { PagingResponse } from '../../model/Responsemodel/PagingResponse';
import { UserResponse } from '../../model/Responsemodel/UserResponse';
import { environment } from '../enviroment/enviroment';
import { AuthenticationRequest } from '../../model/RequestModel/AuthenticationRequest';
import { SearchContRequest } from '../../model/RequestModel/SearchContRequest';
import { ContModal } from '../../model/Responsemodel/ContModal';
import { DeclareContRequest } from '../../model/RequestModel/DeclareContRequest';
import { ConImageResponseWithIDCont } from '../../model/RequestModel/ConImageResponseWithIDCont';
import { CreateAuditRequest } from '../../model/RequestModel/CreateAuditRequest';
import { UpdateUserRequest } from '../../model/RequestModel/UpdateUserRequets';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private httpClient = inject(HttpClient);

  SearchUser = (request: SearchUserModel) => {
    return this.httpClient.post<CommonResponseModal<PagingResponse<UserResponse>>>(
      `${environment.api_domain}/api/User/search-user`,
      request,
    );
  };

  SearchCont = (request: SearchContRequest) => {
    return this.httpClient.post<CommonResponseModal<PagingResponse<ContModal>>>(
      `${environment.api_domain}/api/DeclareCont/get-declare-cont`,
      request,
    );
  };

  DeclareCont = (request: DeclareContRequest) => {
    return this.httpClient.post<CommonResponseModal<ConImageResponseWithIDCont>>(
      `${environment.api_domain}/api/DeclareCont/declare-cont`,
      request,
    );
  }

  Authentication = ((request: AuthenticationRequest) =>{
    return this.httpClient.post<any>(
      `${environment.api_domain}/api/User/authentication`,
      request,
    );
  })

  DeleteUser = (id: number) => {
    return this.httpClient.delete<any>(`${environment.api_domain}/api/User/delete-user${id}`);
  }

  DownloadImage=(id: number)=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/DeclareCont/download-folder/${id}`, { responseType: 'blob' as 'json' });
  }

  AddImagetoCont=(request: FormData)=>{
    return this.httpClient.post<any>(
      `${environment.api_domain}/api/DeclareCont/add-image-to-cont`,request
    );
  }

  CreateAudit=(request: CreateAuditRequest)=>{
    return this.httpClient.post<any>(
      `${environment.api_domain}/api/Audit/create-audit`,request
    );
  }

  GetAudit=(request: any)=>{
    return this.httpClient.post<any>(
      `${environment.api_domain}/api/Audit/get-audit`,request
    );
  }

  DeleteAudit=(id: number)=>{
    return this.httpClient.delete<any>(`${environment.api_domain}/api/Audit/delete-audit/${id}`);
  }

  GetOperationStandard=()=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/Audit/get-all-operationstandard`);
  }

  GetDetechIssue=(id: number)=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/Audit/get-detechissue?id=${id}`);
  }

  GetAssignee=()=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/Audit/get-assignee`);
  }

  CreateAuditDetail=(request: FormData)=>{
    return this.httpClient.post<any>(
      `${environment.api_domain}/api/Audit/create-audit-detail-daily`,request
    );
  }

  GetAuditDetail=(request: any)=>{
    return this.httpClient.post<any>(
      `${environment.api_domain}/api/Audit/get-audit-detail`,request
    );
  }

  GetLocation=()=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/Audit/get-location`);
  }

  GetAuditDetailById=(id: number)=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/Audit/get-auditdetail-by-id?id=${id}`);
  }

  AddImageAfterToAuditDetail=(request: FormData)=>{
    return this.httpClient.post<any>(
      `${environment.api_domain}/api/Audit/add-image-after`,request
    );
  }

  GetRole=()=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/User/get-role`);
  }

  GetPhongBan=()=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/User/get-phongban`);
  }

  UpdateUser=(req: UpdateUserRequest)=>{
    return this.httpClient.post<any>(
      `${environment.api_domain}/api/User/update-user`,req
    );
  }

  GetAuditDetailOwner=(req: any)=>{
    return this.httpClient.post<any>(`${environment.api_domain}/api/Audit/get-audit-owner`, req); 
  }

  PhanCong=(req: any)=>{
    return this.httpClient.post<any>(`${environment.api_domain}/api/Audit/phancong`, req); 
  }

  GetCtpatCriteria=()=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/Audit/get-ctpat-criteria`);
  }

  GetleaveType=()=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/LeaveRequest/get-leavetype`);
  }

  RegisLeave=(req: any)=>{
    return this.httpClient.post<any>(`${environment.api_domain}/api/LeaveRequest/create`, req);
  }

  GetLeaveItem=(code: string)=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/LeaveRequest/get-leave-by-code?code=${code}`);
  }

  PhatHanhDon = (code: string) => {
    return this.httpClient.post<any>(
      `${environment.api_domain}/api/LeaveRequest/phat-hanh-don?code=${code}`,
      {}
    );
  }

  GetpendingAsignee=(curstp: number)=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/LeaveRequest/get-assigne-pending?currstp=${curstp}`);
  }

  GetDsLeavePaging=(req : any)=>{
    return this.httpClient.post<any>(`${environment.api_domain}/api/LeaveRequest/get-ds-leaves`, req);
  }

  GetPendingCurrentStep=(req: any)=>{
    return this.httpClient.post<any>(`${environment.api_domain}/api/LeaveRequest/get-pending-currentstep`, req); 
  }

}
