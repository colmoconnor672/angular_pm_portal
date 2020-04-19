import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskEventsService } from 'src/app/services/task-events.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TasksService } from 'src/app/services/tasks.service';
import { TaskEvent } from 'src/app/models/taskEvent';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-item-file-upload',
  templateUrl: './task-item-file-upload.component.html',
  styleUrls: ['./task-item-file-upload.component.css'],
  providers: [
    // This is for formatting to expected DB date format: yyyy-MM-dd HH:mm:ss
    DatePipe
]
})
export class TaskItemFileUploadComponent implements OnInit, OnDestroy {
  selectedTaskId: number;
  currentUser: User;
  sub1: Subscription;
  sub2: Subscription;
  uploadForm: FormGroup;

  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  constructor(
    private authService: AuthService,
    private tasksService: TasksService, 
    private taskEventService: TaskEventsService,
    private router: Router,
    private route: ActivatedRoute,
    private datepipe: DatePipe) { }


  ngOnInit() {
    // initialise the reactive form elements here
    this.uploadForm = new FormGroup({
      'selectedFile': new FormControl(null, Validators.required),
      'comment': new FormControl(null)
    });

    this.sub1 = this.tasksService.taskSelected.subscribe(
      (selectedTaskId: number) => {
        console.log('TIFUC - selectedTaskId value = ' + selectedTaskId);
        this.selectedTaskId = selectedTaskId;
      }
    );
    
    
    this.sub2 = this.authService.user.subscribe(
      user => {
        console.log('TIFUC - user value = ' + user.id);
        this.currentUser = user;
      }
    );

  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  onFileSelected(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }

  onSubmit() {
    // setup the new TaskEvent record to be inserted in the Database
    let taskEvent: TaskEvent = new TaskEvent();
    taskEvent.comment = this.uploadForm.value.comment;
    taskEvent.filename = this.fileData.name;
    taskEvent.filetype = this.fileData.type;
    taskEvent.eventType = { id: 2, description: 'Upload' };
    let uploadDate = this.datepipe.transform(new Date(), 'dd-MM-yyyy HH:mm');
    taskEvent.event_date = uploadDate;
    taskEvent.taskId = this.selectedTaskId;
    taskEvent.eventUser = {
      id: +this.currentUser.id,
      name: null,
      email: null,
      orgId: null,
      roles: null
    };

    // setup a new FormData instance and add the file and the matching new TaskEvent
    let formData = new FormData();
    formData.append('file', this.fileData);
    formData.append('taskEvent', new Blob([JSON.stringify(taskEvent)], {type: "application/json"}) );

    // use the taskEventService to upload the file and corresponding data
    this.taskEventService.uploadFile(formData).subscribe( (data: any) => {
      console.log('Successfully uploaded file!');
      // leave this component and go back to Task Detail screen - current path is 'fileupload'
      this.router.navigate(['../detail', this.selectedTaskId], {relativeTo: this.route} );
    });

  }

  onCancel(){
      // leave this component and go back to Task Detail screen - current path is 'fileupload'
      this.router.navigate(['../detail', this.selectedTaskId], {relativeTo: this.route} );
  }

}
