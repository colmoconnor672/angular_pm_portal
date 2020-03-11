import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  collapsed = true;
  sub1: Subscription;
  sub2: Subscription;

  organisationId: number;
  projectsUrl: string;
  projects: Observable<Project[]>;

  constructor(
    private authService: AuthService, 
    private organisationService: OrganisationService, 
    private projectsService: ProjectsService) {
    console.log('Header: In constructor method');
   }

  ngOnInit() {
    console.log('Header: In ngOnInit() method');
    this.sub1 = this.authService.user.subscribe(user => {
      console.log('Header: In authService.user.subscribe(..) method');
      //this.isAuthenticated = (!user) ? false : true;
      this.isAuthenticated = !!user;
      console.log('Header: Exiting authService.user.subscribe(..) method. isAuthenticated = ' + this.isAuthenticated);
    });

    this.sub2 = this.organisationService.organisationSelected.subscribe(
      selectedOrganisation => {
        console.log('Header: In organisationSelected.subscribe(..) method');
        this.organisationId = selectedOrganisation;
        //this.projectsUrl = '/projects';
        this.reloadProjectData();
        console.log('Header: Exiting organisationSelected.subscribe(..) method. OrgId = ' + selectedOrganisation);
      }
    );

    console.log('Header: Exiting ngOnInit() method');
  }

  reloadProjectData(){
    if (this.organisationId == undefined) {
      this.projects = this.projectsService.getProjectList();
    } else {
      this.projects = this.projectsService.getProjectListForOrganisation(this.organisationId);
    }
  }

  ngOnDestroy(){
    console.log('Header: In ngOnDestroy() method');
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    console.log('Header: Exiting ngOnDestroy() method');
  }

  onLogout(){
    console.log('Header: In onLogout() method');
    this.authService.logout();
    console.log('Header: Exiting onLogout() method');
  }

  onProjectSelected(id: number) {
    console.log('Header: In onProjectSelected('+ id +') method');
    this.projectsService.projectSelected.next(id);
  }

}
