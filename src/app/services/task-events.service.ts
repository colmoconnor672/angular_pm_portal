import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskEvent } from '../models/taskEvent';

@Injectable({
  providedIn: 'root'
})
export class TaskEventsService {
  private baseUrl = 'http://localhost:8081/pm_portal/api/v1/taskEvents';

  constructor(private http: HttpClient) { }

  downloadFile(id:number): Observable<any>{
    let url: string = `${this.baseUrl}/download/${id}`;
    const result: Observable<any> = this.http.get(url, {responseType: 'blob'});
    return result;
  }

  uploadFile(formData: FormData){
    let url: string = `${this.baseUrl}/Upload`;
    let result = this.http.post(
                              url, 
                              formData, 
                              // we need this Header to force the Browser 
                              // to set the type and file boundary correctly
                              { headers: { "Content-Type": undefined }} );
    return result;
  }



  getTaskEvent(id: number): Observable<any> {
    console.log('........... Entered getTask('+id+') method .................');
    let task: Observable<any> = undefined;
    let url: string = `${this.baseUrl}/${id}`;
    task = this.http.get<TaskEvent>(url);
    return task;
  }

  createTaskEvent(task: TaskEvent): Observable<any> {
    let targetUrl: string = this.baseUrl + '/' + task.eventType.description;
    let result: Observable<any> = null;
    result = this.http.post(targetUrl, task);
    //this.tasksUpdated.next(task.id)
    return result;
  }

  updateTaskEvent(id: number, value: TaskEvent): Observable<any> {
    let targetUrl: string = this.baseUrl + '/' + value.eventType.description;
    let result: Observable<any> = null;
    result = this.http.put(`${targetUrl}/${id}`, value);
    //this.tasksUpdated.next(id);
    return result;
  }

  deleteTaskEvent(id: number): Observable<any> {
    let result: Observable<any> = null;
    result = this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
    //this.tasksUpdated.next(id)
    return result;
  }

}
