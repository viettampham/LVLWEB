import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonResponseModal } from '../../model/Responsemodel/CommonResponseModal';
import { SearchUserModel } from '../../model/RequestModel/SearchUserModel';
import { PagingResponse } from '../../model/Responsemodel/PagingResponse';
import { UserResponse } from '../../model/Responsemodel/UserResponse';
import { environment } from '../enviroment/enviroment';
import { AuthenticationRequest } from '../../model/RequestModel/AuthenticationRequest';

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

  Authentication = ((request: AuthenticationRequest) =>{
    return this.httpClient.post<any>(
      `${environment.api_domain}/api/User/authentication`,
      request,
    );
  })
}
