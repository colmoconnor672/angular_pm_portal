import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  private userid: number;
  currentUser: User;
  private sub1: Subscription;
  private sub2: Subscription;

  constructor(
    private usersService: UsersService, 
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {

    // this.sub2 = this.usersService.userItemUpdated.subscribe(
    //   (selectedUserId: number) => {
    //     if(selectedUserId){
    //       console.log('UDC - usersService.userItemUpdated.subscribe(.) - main selectedUserId value = ' + selectedUserId);
    //       //this.loadData(selectedUserId);
    //     }
    //   }
    // );

    // this.sub1 = this.usersService.userItemChosen.subscribe(
    //   (chosenUserId: number) => {
    //     console.log('UDC - usersService.userItemChosen.subscribe(.) - chosenUserId value = ' + chosenUserId);
    //     this.userid = chosenUserId;
    //     this.loadData(chosenUserId);
    //   }
    // );

    this.route.params.subscribe(
      (params: Params) => {
        this.userid = params['id'];
        console.log('UDC - route.params.subscribe(..) route UserId value = ' + this.userid);
        this.usersService.userItemChosen.next(this.userid);
        this.loadData(this.userid);
      }
    )

  }

  loadData(userId: number) {
    console.log('UDC - In loadData(' + userId + ')');
    if (userId != null){
      this.usersService.getUser(userId).subscribe(
        user => {
          console.log('UDC - loadData - In usersService.getUser(' + user.id + ') - returned ok');
          this.currentUser = user;
        }
      );
    }
  }


  onEditUser(){
    const id: number = + this.route.snapshot.params['id'];
    this.router.navigate(['../../edit', id], {relativeTo: this.route} );
  }

  onAddUser(){
    this.router.navigate(['../../add'], {queryParams: {addMode: 'true'}, relativeTo: this.route} );
  }

  getRolesString(){
    let rolesString = '';
    this.currentUser.roles.forEach( (role:Role, index:number, array:Role[]) => {
      rolesString = rolesString + role.roleDescription;
    })
    return rolesString;
  }

  ngOnDestroy(){
    //this.sub1.unsubscribe();
  }

}
