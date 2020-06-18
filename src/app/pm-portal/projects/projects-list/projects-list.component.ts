import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from 'src/app/models/project';
import { Observable, Subscription } from 'rxjs';
import { OrganisationService } from 'src/app/services/organisation.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit, OnDestroy {
  projects: Project[];
  orgId: number;
  isAuthenticated = false;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;

  constructor(
    private authService: AuthService, 
    private orgService: OrganisationService, 
    private projectsService: ProjectsService) {}

    ngOnInit() {
      console.log('PLC - In ngOnInit() method - b4 projectsService.projectSelected.subscribe ..');
      
      this.sub1 = this.authService.user.subscribe(user => {
        console.log('Header: In authService.user.subscribe(..) method');
        //this.isAuthenticated = (!user) ? false : true;
        this.isAuthenticated = !!user;
        if(this.isAuthenticated && this.orgId == null){
          this.orgId = user.orgId;
        }
        console.log('Header: Exiting authService.user.subscribe(..) method. isAuthenticated = ' + this.isAuthenticated);
      });

      this.sub2 = this.orgService.organisationSelected.subscribe(
        (newOrgId: number) => {
          console.log('PLC - orgId value = ' + newOrgId);
          if(newOrgId){
            this.orgId = newOrgId;
          }
          this.reloadData();
        }
      );
  
      this.sub3 = this.projectsService.projectItemUpdated.subscribe(
        selectedProject => {
          console.log('PLC - In projectsService.projectSelected.subscribe');
          this.reloadData();
        }
      );
  
  
    }
  
    reloadData() {
      console.log('PLC - In reloadData() method');
      if(this.orgId != null){
        this.projectsService.getProjectListForOrganisation(this.orgId).subscribe(
          (list: Project[]) => {
            if(list.length > 0) {
              this.projects = list;
            }
          }
        );
      }
    }
    
    
    ngOnDestroy(){
      console.log('PLC - In ngOnDestroy() method');
      this.sub1.unsubscribe();
      this.sub2.unsubscribe();
      this.sub3.unsubscribe();
    }
  
  }
