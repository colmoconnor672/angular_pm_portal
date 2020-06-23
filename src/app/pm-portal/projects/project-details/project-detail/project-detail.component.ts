import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/project';
import { ProjectsService } from 'src/app/services/projects.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private projectid: number;
  currentProject: Project;
  private sub1: Subscription;
  private sub2: Subscription;

  constructor(
    private projectsService: ProjectsService, 
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {

    // this.sub2 = this.projectsService.projectItemUpdated.subscribe(
    //   (selectedProjectId: number) => {
    //     if(selectedProjectId){
    //       console.log('PDC - projectsService.projectItemUpdated.subscribe(.) - main selectedProjectId value = ' + selectedProjectId);
    //       //this.loadData(selectedProjectId);
    //     }
    //   }
    // );

    // this.sub1 = this.projectsService.projectItemChosen.subscribe(
    //   (chosenProjectId: number) => {
    //     console.log('PDC - projectsService.projectItemChosen.subscribe(.) - chosenProjectId value = ' + chosenProjectId);
    //     this.projectid = chosenProjectId;
    //     this.loadData(chosenProjectId);
    //   }
    // );

    this.route.params.subscribe(
      (params: Params) => {
        this.projectid = params['id'];
        console.log('PDC - route.params.subscribe(..) route ProjectId value = ' + this.projectid);
        this.projectsService.projectItemChosen.next(this.projectid);
        this.loadData(this.projectid);
      }
    )

  }

  loadData(projectId: number) {
    console.log('PDC - In loadData(' + projectId + ')');
    if (projectId != null){
      this.projectsService.getProject(projectId).subscribe(
        project => {
          console.log('PDC - loadData - In projectsService.getProject(' + project.id + ') - returned ok');
          this.currentProject = project;
        }
      );
    }
  }


  onEditProject(){
    const id: number = + this.route.snapshot.params['id'];
    this.router.navigate(['../../edit', id], {relativeTo: this.route} );
  }

  onAddProject(){
    this.router.navigate(['../../add'], {queryParams: {addMode: 'true'}, relativeTo: this.route} );
  }

  ngOnDestroy(){
    //this.sub1.unsubscribe();
  }

}
