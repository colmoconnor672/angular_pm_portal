import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskStatus } from '../models/TaskStatus';
import { TaskPriority } from '../models/TaskPriority';

@Injectable({
  providedIn: 'root'
})
export class SupportDataService {

  private baseUrl = 'http://localhost:8081/pm_portal/api/v1/supportData';
  
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

}
