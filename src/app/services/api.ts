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
import { ConImageResponse } from '../../model/Responsemodel/ConImageResponse';
import { DeclareContRequest } from '../../model/RequestModel/DeclareContRequest';
import { ConImageResponseWithIDCont } from '../../model/RequestModel/ConImageResponseWithIDCont';

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

  ViewImage=(id: number)=>{
    return this.httpClient.get<any>(`${environment.api_domain}/api/DeclareCont/view-image?id=${id}`);
  }
}
