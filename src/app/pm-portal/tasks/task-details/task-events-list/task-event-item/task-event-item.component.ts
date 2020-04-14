import { Component, OnInit, Input } from '@angular/core';
import { TaskEvent } from 'src/app/models/taskEvent';
import { TaskDependenciesService } from 'src/app/services/task-dependencies.service';
import { TaskEventsService } from 'src/app/services/task-events.service';
import * as FileSaver from 'file-saver';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-task-event-item',
  templateUrl: './task-event-item.component.html',
  styleUrls: ['./task-event-item.component.css']
})
export class TaskEventItemComponent implements OnInit {
  private isAuthor = false;
  @Input() eventItem: TaskEvent;

  constructor(private taskEventsService: TaskEventsService, private authService: AuthService) { }

  ngOnInit() {
    if(this.authService.isCurrentUserId(this.eventItem.eventUser.id) ) {
      this.isAuthor = true;
    }
  }

  onOpenFile(id:number){
    this.taskEventsService.downloadFile(id).subscribe(
      response => {
        console.log(response);
        const url= window.URL.createObjectURL(response);
        window.open(url, '_blank');
      }, 
      error => console.log('Error downloading the file'),
      () => console.info('File downloaded successfully')
    );
  }

  onDownloadFile(id:number, filename:string){
    this.taskEventsService.downloadFile(id).subscribe(
      response => {
        console.log(response);
        FileSaver.saveAs(response, filename);
        //window.location.href = response.url;
      }, 
      error => console.log('Error downloading the file'),
      () => console.info('File downloaded successfully')
    );
  }

  // getFile(id:number, returnBlob:boolean): any {
  //   this.taskEventsService.downloadFile(id).subscribe(
  //     response => {
  //       console.log(response);
  //       const url= window.URL.createObjectURL(response);
  //       window.open(url, '_blank');
  //     }, 
  //     error => console.log('Error downloading the file'),
  //     () => console.info('File downloaded successfully')
  //   );
  // }

}
