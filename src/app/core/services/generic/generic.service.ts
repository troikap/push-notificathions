import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericService {
  pathApiUrl: string = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  async setToken( token: string ): Promise<any>{
    const response: any = await this.http.post(`${this.pathApiUrl}/token`, {token});
    return response;
  }

  async getToken(  ): Promise<any>{
    const response: any = await this.http.get(`${this.pathApiUrl}/token`);
    return response;
  }
}
