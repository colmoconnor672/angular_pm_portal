import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authenticatedUser: User;
  isAuthenticated = false;
  collapsed = true;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;

  organisationId: number;
  projectsUrl: string;
  projects: Project[];

  headerForm: FormGroup;

  constructor(
    private authService: AuthService, 
    private organisationService: OrganisationService, 
    private projectsService: ProjectsService) {
    console.log('Header: In constructor method');
   }

  ngOnInit() {
    console.log('Header: In ngOnInit() method');

    this.headerForm = new FormGroup({
      'selectedProject': new FormControl(null)
    });

    this.sub1 = this.authService.user.subscribe(user => {
      console.log('Header: In authService.user.subscribe(..) method');
      this.authenticatedUser = user;
      //this.isAuthenticated = (!user) ? false : true;
      this.isAuthenticated = !!user;
      console.log('Header: Exiting authService.user.subscribe(..) method. isAuthenticated = ' + this.isAuthenticated);
    });

    this.sub2 = this.organisationService.organisationSelected.subscribe(
      selectedOrganisation => {
        console.log('Header: In organisationSelected.subscribe(..) method');
        this.organisationId = selectedOrganisation;
        if(this.isAuthenticated && this.organisationId == null) {
          // if this happens then a full page reload must have ocurred - normal login orgID WOULDN'T be null!
          // Therefore - manually set the organisationId to the user.orgId value
          this.organisationId = this.authenticatedUser.orgId;
          this.organisationService.organisationSelected.next(this.organisationId);
        }
        this.loadProjectData();
        console.log('Header: Exiting organisationSelected.subscribe(..) method. OrgId = ' + this.organisationId);
      }
    );

    this.sub3 = this.projectsService.projectItemUpdated.subscribe(
     updatedProjectId => {
        console.log('Header - In projectsService.projectItemUpdated.subscribe - reloading Projects Combo, selectedProject =' + this.headerForm.value.selectedProject);
        let projIdSelectd = this.headerForm.value.selectedProject;
        this.loadProjectData();
        this.headerForm.setValue({selectedProject: 0});
        this.headerForm.setValue({selectedProject: projIdSelectd});
      }
    );

    console.log('Header: Exiting ngOnInit() method');
  }

  loadProjectData(){
    console.log('Header.loadProjectData() - orgId = '+ this.organisationId +', selected = ' + this.headerForm.value.selectedProject );  // + ', selectedProject = ' + this.selectedProject);
    if(this.organisationId != null){
      console.log('Header.loadProjectData() - now re-quering the DB for Projects List');
      this.projectsService.getProjectListForOrganisation(this.organisationId).subscribe(
        (list: Project[]) => {
          this.projects = list;
          this.setSelectedProject();
        }
      );
    }
  }

  ngOnDestroy(){
    console.log('Header: In ngOnDestroy() method');
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    console.log('Header: Exiting ngOnDestroy() method');
  }

  onLogout(){
    console.log('Header: In onLogout() method');
    this.authService.logout();
    // reset these global events
    this.projectsService.projectSelected.next(null);
    this.organisationService.organisationSelected.next(null);
    console.log('Header: Exiting onLogout() method');
  }

  isProjectSelected(id:number){
    if(!this.headerForm.value.selectedProject){
      return false;
    } else {
      return id == this.headerForm.value.selectedProject;
    }
  }

  onProjectSelected(event) {
    const value = event.target.value;
    this.headerForm.setValue( {selectedProject: +value} );
    console.log('Header: In onProjectSelected('+ value +') method');
    this.setSelectedProject();
  }

  private setSelectedProject(){
    if(this.headerForm.value.selectedProject){
      let selProjId: number = this.headerForm.value.selectedProject;
      this.projectsService.projectSelected.next(selProjId);
    }
  }

}
