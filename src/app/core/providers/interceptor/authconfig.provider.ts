import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse, HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable()
export class Authconfig implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq: HttpRequest<any> = req;
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      // 'Host': '*',
      // 'Accept-Encoding': 'gzip, deflate, br',
      // 'Connection': 'keep-alive',
    });
    authReq = authReq.clone({ headers });
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse)=> {
        if (err.status == 401) {
          console.log('ERROR INTERCEPTOR ', err);
        }
        return throwError(() => err);
      })
    );
  }
}

export const authconfigProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: Authconfig, multi: true }
];
