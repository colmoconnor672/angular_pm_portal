import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-default',
  templateUrl: './user-default.component.html',
  styleUrls: ['./user-default.component.css']
})
export class UserDefaultComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  onAddUser(){
    this.router.navigate(['add'], {queryParams: {addMode: 'true'}, relativeTo: this.route} );
  }

}
