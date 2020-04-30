import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Task } from '../models/task';

@Injectable()
export class TasksService {

  private baseUrl = 'http://localhost:8081/pm_portal/api/v1/task';

  taskSelected = new BehaviorSubject<number>(null);
  tasksUpdated = new Subject<number>();

  constructor(private http: HttpClient) { }

  getTaskList(): Observable<any> {
    console.log('........... Entered getTaskList() method .................');
    let result: Observable<any> = this.http.get(`${this.baseUrl}`);
    return result;
  }

	getProjectTasksAsPromise(projectId: number): Promise<Task[]> {
    return this.getTaskListForProject(projectId).toPromise();
	}

  handleError(error: any): Promise<any>{
    console.log(error);
    return Promise.reject(error);
  }
  
  getTaskListForProject(projectId: number): Observable<any> {
    console.log('........... Entered getTaskListForProject('+projectId+') method .................');
    let result: Observable<any> = undefined;
    if (projectId) {
      let url = this.baseUrl + 'ForProject'
      result = this.http.get(`${url}/${projectId}`);
    } 
    // else {
    //   result = this.getTaskList();
    // }
    return result;
  }


  getTask(id: number): Observable<any> {
    console.log('........... Entered getTask('+id+') method .................');
    let task: Observable<any> = undefined;
    let url: string = `${this.baseUrl}/${id}`;
    task = this.http.get<Task>(url);
    return task;
  }

  createTask(task: Task): Observable<any> {
    let result: Observable<any> = null;
    result = this.http.post(`${this.baseUrl}`, task);
    this.tasksUpdated.next(task.id)
    return result;
  }

  updateTask(id: number, value: any): Observable<any> {
    let result: Observable<any> = null;
    result = this.http.put(`${this.baseUrl}/${id}`, value);
    this.tasksUpdated.next(id);
    return result;
  }

  deleteTask(id: number): Observable<any> {
    let result: Observable<any> = null;
    result = this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
    this.tasksUpdated.next(id)
    return result;
  }

  getSVB_ChartData(orgId:number, projectId:number, startDate:string, endDate:string, extendedSearch: boolean): Observable<any>{
    console.log('Entered getSVB_ChartData('+orgId+') method');
    let result: Observable<any> = undefined;
    let url: string = '';
    if(projectId == null){
      url = `${this.baseUrl}AnalysisByOrg/${orgId}`;
    } else {
      url = `${this.baseUrl}AnalysisByProject/${orgId}/${projectId}`;
    }
    if(startDate != null && endDate != null) {
      if(projectId == null){
        url = `${this.baseUrl}AnalysisByDate/${orgId}/${startDate}/${endDate}`;
      } else {
        url = `${this.baseUrl}AnalysisByProjectDate/${orgId}/${projectId}/${startDate}/${endDate}`;
      }
    }
    url = url + '/' + !!extendedSearch;

    result = this.http.get(url);
    return result;
  }
}
