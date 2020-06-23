import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TaskDependency } from '../models/taskDependency';
import { environment } from '../../environments/environment';

@Injectable()
export class TaskDependenciesService {

  private baseUrl = environment.targetSpringBootUrl + 'taskDependencies';

  constructor(private http: HttpClient) { }

  get(): Observable<TaskDependency[]> {
    console.log('........... Entered TaskDependenciesService.get() method .................');
    let result: Observable<TaskDependency[]> = this.http.get<TaskDependency[]>(`${this.baseUrl}`);
    return result;
  }

	getTaskDependenciesAsPromise(projectId: number): Promise<TaskDependency[]> {
    let url = this.baseUrl + 'ForProject/' + projectId;
		return this.http.get<TaskDependency[]>(url)
      .toPromise()
			.catch(this.handleError);
	}

  handleError(error: any): Promise<any>{
    console.log(error);
    return Promise.reject(error);
  }

  getById(id: number): Observable<TaskDependency> {
    console.log('........... Entered TaskDependenciesService.getById('+id+') method .................');
    let task: Observable<any> = undefined;
    let url: string = `${this.baseUrl}/${id}`;
    task = this.http.get<TaskDependency>(url);
    return task;
  }

  insert(taskDep: TaskDependency): Observable<TaskDependency> {
    console.log('........... Entered TaskDependenciesService.insert(taskDep) method .................');
    let result: Observable<TaskDependency> = null;
    result = this.http.post<TaskDependency>(`${this.baseUrl}`, taskDep);
    return result;
  }

  update(id: number, value: any): Observable<Object> {
    console.log('........... Entered TaskDependenciesService.update('+id+') method .................');
    let result: Observable<Object> = null;
    result = this.http.put(`${this.baseUrl}/${id}`, value);
    return result;
  }

  remove(id: number): Observable<any> {
    console.log('........... Entered TaskDependenciesService.remove('+id+') method .................');
    let result: Observable<any> = null;
    result = this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
    return result;
  }
}
