import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface AuthResponseData {
  id: string;
  email: string;
  orgId: string;
  projectId: number;
  authorities: string;
  roles: string;
  token: string;
  expiresIn:	string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/pm_portal/api/v1/';
  private tokenExpirationTimer: any;
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {}

  registerUser(
    email: string, 
    password: string, 
    orgName: string, 
    orgEmail: string, 
    orgPhone: string) 
  {
    const registerOrgUserUrl = this.baseUrl + 'registerOrgUser';
    return this.http.post<AuthResponseData>(
      registerOrgUserUrl, 
      {
        orgName: orgName,
        orgEmail: orgEmail,
        orgPhone: orgPhone,
        email: email, 
        password: password
      }
    ).pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    const registerOrgUserUrl = this.baseUrl + 'login';
    return this.http.post<AuthResponseData>(
      registerOrgUserUrl, 
      {
        email: email, 
        password: password
      }
    )
    .pipe(
      catchError(this.handleError), 
      tap(resData => {
        this.handleAuthentication(
          resData.email, 
          resData.id, 
          resData.authorities,
          resData.roles,
          resData.token, 
          +resData.expiresIn)
      })
    );
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      authorities: string,
      roles: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(userData.email, userData.id, userData.authorities, userData.roles, userData._token, new Date(userData._tokenExpirationDate));
    
    if(loadedUser.token){
      this.user.next(loadedUser);
      const expiresDuration = (
        new Date(userData._tokenExpirationDate).getTime()  - new Date().getTime() );
      this.autoLogout(expiresDuration);
    }
  }

  logout(){
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration_ms: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration_ms);
  }




  private handleAuthentication(email: string, userId: string, authorities: string, roles: string, token: string, expiresIn: number) {
    const expirationDate = new Date(
      new Date().getTime() + (expiresIn * 1000) 
    );
    const user = new User(email, userId, authorities, roles, token, expirationDate)
    this.user.next(user);

    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResp: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorResp.error || !errorResp.error.error) {
      return throwError(errorMessage);
    }
    switch(errorResp.error.error.message){
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password!';
        break;
      case 'TOKEN_GENERATION_FAILURE':
        errorMessage = 'Operation not available at this time. Please try later.';
        break;
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists!';
        break;
      case 'ORGANISATION_EXISTS':
        errorMessage = 'This Organisation already exists!';
        break;
      case 'OPERATION_NOT_POSSIBLE':
        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
    }
    return throwError(errorMessage);
  }
  
}
