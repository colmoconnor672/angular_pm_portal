import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupportDataService {

  private baseUrl = environment.targetSpringBootUrl + 'supportData';
  private rolesUrl = environment.targetSpringBootUrl + 'roles';
  
  constructor(private http: HttpClient) { }

  getTaskStatusList(): Observable<any> {
    console.log('........... Entered getTaskStatusList() method .................');
    let url: string = this.baseUrl + '/statusList';
    let result: Observable<any> = this.http.get<any>(url);
    return result;
  }

  getTaskPriorityList(): Observable<any> {
    console.log('........... Entered getTaskStatusList() method .................');
    let url: string = this.baseUrl + '/priorityList';
    let result: Observable<any> = this.http.get<any>(url);
    return result;
  }

  getUserRolesList(): Observable<any> {
    console.log('........... Entered getUserRolesList() method .................');
    let result: Observable<any> = this.http.get<any>(this.rolesUrl);
    return result;
  }

}
