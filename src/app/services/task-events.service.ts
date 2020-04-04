import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

}
