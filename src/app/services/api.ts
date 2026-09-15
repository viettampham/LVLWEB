import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonResponseModal } from '../../model/Responsemodel/CommonResponseModal';
import { SearchUserModel } from '../../model/RequestModel/SearchUserModel';
import { PagingResponse } from '../../model/Responsemodel/PagingResponse';
import { UserResponse } from '../../model/Responsemodel/UserResponse';
import { environment } from '../enviroment/enviroment';

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
}
