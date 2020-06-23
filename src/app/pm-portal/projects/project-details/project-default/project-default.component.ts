import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-default',
  templateUrl: './project-default.component.html',
  styleUrls: ['./project-default.component.css']
})
export class ProjectDefaultComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  onAddProject(){
    this.router.navigate(['../add'], {queryParams: {addMode: 'true'}, relativeTo: this.route} );
  }

}
