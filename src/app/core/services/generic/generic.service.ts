import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericService {
  pathApiUrl: string = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  async setToken( token: string, user?: string, device?: string ): Promise<any>{
    const response: any = await lastValueFrom(this.http.post(`${this.pathApiUrl}/tokens`, {token, user, device}));
    return response;
  }

  async getToken( ): Promise<any>{
    const response: any = await lastValueFrom(this.http.get(`${this.pathApiUrl}/tokens`));
    return response;
  }

  async getHello( ): Promise<any>{
    const response: any = await lastValueFrom(this.http.get(`${this.pathApiUrl}/hello`));
    return response;
  }

  async setMessage(payload: { tokens: any, title: string, message: string}) {
    const response: any = await lastValueFrom(this.http.post(`${this.pathApiUrl}/send-push-notification-firebase`, payload));
    return response;
  }
}
