import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Task } from '../models/task';

@Injectable()
export class TasksService {

  private baseUrl = 'http://localhost:8081/pm_portal/api/v1/tasks';

  taskSelected = new Subject<number>();
  tasksUpdated = new Subject<number>();

  constructor(private http: HttpClient) { }

  getTaskList(): Observable<any> {
    console.log('........... Entered getTaskList() method .................');
    let result: Observable<any> = this.http.get(`${this.baseUrl}`);
    return result;
  }

  
  getTaskListForProject(projectId: number): Observable<any> {
    console.log('........... Entered getTaskListForProject('+projectId+') method .................');
    let result: Observable<any> = undefined;
    if (projectId) {
      let url = this.baseUrl + 'ForProject'
      result = this.http.get(`${url}/${projectId}`);
    } else {
      result = this.getTaskList();
    }
    return result;
  }


  getTask(id: number): Observable<any> {
    console.log('........... Entered getTask('+id+') method .................');
    let task: Observable<any> = undefined;
    let url: string = `${this.baseUrl}/${id}`;
    task = this.http.get<Task>(url);
    return task;
  }

  createTask(task: Task): Observable<Object> {
    let result: Observable<Object> = null;
    result = this.http.post(`${this.baseUrl}`, task);
    this.tasksUpdated.next(task.id)
    return result;
  }

  updateTask(id: number, value: any): Observable<Object> {
    let result: Observable<Object> = null;
    result = this.http.put(`${this.baseUrl}/${id}`, value);
    this.tasksUpdated.next(id)
    return result;
  }

  deleteTask(id: number): Observable<any> {
    let result: Observable<any> = null;
    result = this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
    this.tasksUpdated.next(id)
    return result;
  }

}
