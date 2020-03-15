import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  
  constructor(private authService: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler){
      return this.authService.user.pipe(
          take(1), 
          exhaustMap(user => {
              const securityHeaders = new HttpHeaders( { 
                'Authorization': 'Basic ' + btoa('admin' + ':' + 'password') 
              });
              if(!user){
                const modifiedReq = req.clone({
                  headers: securityHeaders
                })
                console.log('In AuthInterceptorService: NO USER - added security header only!');
                return next.handle(modifiedReq);
              }
              const modifiedReq = req.clone({
                  headers: securityHeaders,
                  params: new HttpParams().set('auth', user.token)
              })
              console.log('In AuthInterceptorService: HAS USER - added both security and Auth headers!');
              return next.handle(modifiedReq);
          })
      );
  }

}
