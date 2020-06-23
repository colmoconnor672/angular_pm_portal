import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = environment.targetSpringBootUrl + 'users';

  userItemUpdated = new BehaviorSubject<number>(null);
  userItemChosen = new BehaviorSubject<number>(null);
  
  constructor(private http: HttpClient) { }


  getUserList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getUsersForOrg(orgId:number): Observable<any> {
    const url = this.baseUrl + 'ForOrg/' + orgId;
    return this.http.get(url);
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createUser(organisation: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, organisation);
  }

  updateUser(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

}
