import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class OrganisationService {

  private baseUrl = 'http://localhost:8081/pm_portal/api/v1/organisations';

  organisationSelected = new BehaviorSubject<number>(null);

  constructor(private http: HttpClient) { }


  getOrganisationList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getOrganisation(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createOrganisation(organisation: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, organisation);
  }

  updateOrganisation(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteOrganisation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

}
