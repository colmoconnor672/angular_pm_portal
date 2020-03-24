import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class ProjectsService {
  private baseUrl = 'http://localhost:8081/pm_portal/api/v1/projects';

  projectSelected = new BehaviorSubject<number>(null);

  //private currentProjectId: number = null;

  constructor(private http: HttpClient) { }

  // getCurrentProjectId(){
  //   return this.currentProjectId;
  // }

  // setCurrentProjectId(projectId: number) {
  //   this.currentProjectId = projectId
  // }

  getProjectList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getProjectListForOrganisation(orgId: number): Observable<any> {
    let url: string = this.baseUrl + 'ForOrg'
    return this.http.get(`${url}/${orgId}`);
  }

  getProject(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createProject(project: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, project);
  }

  updateProject(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
