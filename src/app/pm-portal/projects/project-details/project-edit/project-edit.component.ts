import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Project } from 'src/app/models/project';
import { ProjectsService } from 'src/app/services/projects.service';
import { OrganisationService } from 'src/app/services/organisation.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {
  private isAddMode: boolean = false;
  private orgId: number;
  private projectId: number;
  currentProject: Project;
  private sub1: Subscription;

  projectForm: FormGroup;

  constructor(
    private orgService: OrganisationService,
    private projectsService: ProjectsService,
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.sub1 = this.orgService.organisationSelected.subscribe(org => {
      this.orgId = org;
      console.log('PEC - orgService.organisationSelected.subscribe. Parameter orgId = ' + this.orgId);
    });

    this.projectsService.projectItemChosen.subscribe(projId => {
      this.projectId = projId;
    });

    // initialise the reactive form elements here
    this.projectForm = new FormGroup({
      'id': new FormControl(null),
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'orgId': new FormControl(null)
    });

    this.route.params.subscribe(
      (params: Params) => {
        let index: number = +params['id'];
        if(index) {
          this.projectId = index;
        }
        let mode = this.route.snapshot.queryParams['addMode'];
        this.isAddMode = (mode === 'true') ? true : false;
        this.loadData(this.projectId, this.isAddMode);
      }
    )

  }

  loadData(projectId: number, isAddMode: boolean) {
    console.log('PEC -  in loadData(.) method. Parameter isAddMode = ' + isAddMode);
    if (isAddMode) {
      this.projectForm.setValue(
        {
          id: null,
          name: null,
          description: null,
          orgId: this.orgId
        }
      );
    } 
    else {
      this.projectsService.getProject(projectId).subscribe(
        project => {
          console.log('PEC - loadData() - in projectsService.getProject(' + project + ').subscribe return area - ok');
          this.currentProject = project;
          this.projectForm.setValue(
            {
              id: project.id,
              name: project.name,
              description: project.description,
              orgId: project.orgId,
            }
          );
        }
      );
    }
  }

  onSubmit(){
    console.log('PEC - In onSubmit() method. Form values submitted are ..');
    console.log(this.projectForm);

    // prepare a new Task instance based on incoming user values
    let updatedProject: Project = new Project();
    updatedProject.id = this.projectForm.value.id;
    updatedProject.name = this.projectForm.value.name;
    updatedProject.description = this.projectForm.value.description;
    updatedProject.orgId = this.projectForm.value.orgId;

    if(this.isAddMode) {
      // call local projectsService to ADD the PROJECT to the DB via REST api
      this.projectsService.createProject(updatedProject).subscribe(
        (project: Project ) => {
          this.currentProject = project;
          this.projectId = project.id;
          console.log('PEC - Added new Project with id ' + project.id);
          console.log('PEC - last Route = ' + this.route.toString() );
          console.log('PEC - last Route.queryParams = ' + this.route.queryParams );

          this.router.navigate(['../detail', this.projectId], {relativeTo: this.route});
          this.projectsService.projectItemUpdated.next(project.id);
        }
      );
    } 
    else {
      // call local projectsService to UPDATE the PROJECT in the DB via REST api
      this.projectsService.updateProject(updatedProject.id, updatedProject).subscribe(
        (project: Project ) => {
          this.currentProject = project;
          this.projectId = project.id;
          console.log('PEC - Updated existing Project with id ' + this.projectId);
          this.router.navigate(['../../detail', this.projectId], {relativeTo: this.route} );
          this.projectsService.projectItemUpdated.next(this.projectId);
        }
      );
    }

  }

  onCancel(){
    if(!this.projectId){
      this.router.navigate(['../'], {relativeTo: this.route} );
    }
    if(this.isAddMode) {
      this.router.navigate(['../detail', this.projectId], {relativeTo: this.route} );
    } else {
      this.router.navigate(['../../detail', this.projectId], {relativeTo: this.route} );
    }
  }

  ngOnDestroy(){
    // unsubscribe from all subscriptions
    this.sub1.unsubscribe();
  }

}
