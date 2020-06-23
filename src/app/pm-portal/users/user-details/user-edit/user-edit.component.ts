import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { SupportDataService } from 'src/app/services/support-data.service';
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  allRoles: Role[];

  isAddMode: boolean = false;
  private orgId: number;
  private userId: number;
  currentUser: User;
  private sub1: Subscription;
  private sub2: Subscription;

  userForm: FormGroup;

  constructor(
    private orgService: OrganisationService,
    private usersService: UsersService,
    private supportDataService: SupportDataService,
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.sub1 = this.orgService.organisationSelected.subscribe(org => {
      this.orgId = org;
      console.log('UEC - orgService.organisationSelected.subscribe. Parameter orgId = ' + this.orgId);
    });

    this.sub2 = this.usersService.userItemChosen.subscribe(userId => {
      this.userId = userId;
      console.log('UEC - orgService.organisationSelected.subscribe. Parameter orgId = ' + this.orgId);
    });

    // get a list of Roles from DB
    this.supportDataService.getUserRolesList().subscribe(rolesList => {
      this.allRoles = rolesList;
    });

    // initialise the reactive form elements here
    this.userForm = new FormGroup({
      'id': new FormControl(null),
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required),
      'password': new FormControl(null),
      'roles': new FormControl(null, Validators.required),
      'authorities': new FormControl(null),
      'orgId': new FormControl(null)
    });

    this.route.params.subscribe(
      (params: Params) => {
        let index: number = +params['id'];
        if(index) {
          this.userId = index;
        }
        let mode = this.route.snapshot.queryParams['addMode'];
        this.isAddMode = (mode === 'true') ? true : false;
        this.loadData(this.userId, this.isAddMode);
      }
    )

  }

  loadData(userId: number, isAddMode: boolean) {
    console.log('UEC -  in loadData(.) method. Parameter isAddMode = ' + isAddMode);
    if (isAddMode) {
      this.userForm.setValue(
        {
          id: null,
          name: null,
          email: null,
          password: null,
          roles: null,
          authorities: null,
          orgId: this.orgId
        }
      );
    } 
    else {
      this.usersService.getUser(userId).subscribe(
        user => {
          console.log('UEC - loadData() - in usersService.getUser(' + user + ').subscribe return area - ok');
          this.currentUser = user;
          this.userForm.setValue(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              password: null,
              roles: user.roles,
              authorities: user.authorities,
              orgId: user.orgId,
            }
          );
        }
      );
    }
  }

  onSubmit(){
    console.log('UEC - In onSubmit() method. Form values submitted are ..');
    console.log(this.userForm);

    // prepare a new Task instance based on incoming user values
    let updatedUser: User = new User(
      this.userForm.value.email,
      this.userForm.value.id,
      this.userForm.value.name,
      this.userForm.value.orgId,
      this.userForm.value.authorities,
      this.userForm.value.roles,
      null,
      null, null);

    if(this.isAddMode) {
      // only allow setting of user password in ADD mode
      updatedUser.setPassword(this.userForm.value.password);
      // call local usersService to ADD the PROJECT to the DB via REST api
      this.usersService.createUser(updatedUser).subscribe(
        (user: User ) => {
          this.currentUser = user;
          this.userId = + user.id;
          console.log('UEC - Added new User with id ' + user.id);
          console.log('UEC - last Route = ' + this.route.toString() );
          console.log('UEC - last Route.queryParams = ' + this.route.queryParams );

          this.router.navigate(['../detail', this.userId], {relativeTo: this.route});
          this.usersService.userItemUpdated.next(+ user.id);
        }
      );
    } 
    else {
      // call local usersService to UPDATE the PROJECT in the DB via REST api
      this.usersService.updateUser(+updatedUser.id, updatedUser).subscribe(
        (user: User ) => {
          this.currentUser = user;
          this.userId = +user.id;
          console.log('UEC - Updated existing User with id ' + this.userId);
          this.router.navigate(['../../detail', this.userId], {relativeTo: this.route} );
          this.usersService.userItemUpdated.next(this.userId);
        }
      );
    }

  }

  isRoleSelected(id:number){
    let retVal = false;
    if(!this.currentUser || !this.currentUser.roles) {
      return retVal;
    }
    this.currentUser.roles.forEach( (role:Role, index:number, array:Role[]) => {
      if(id === role.id){
        retVal = true;
      }
    })
    return retVal;
  }

  onCancel(){
    if(!this.userId){
      this.router.navigate(['../'], {relativeTo: this.route} );
    }
    if(this.isAddMode) {
      this.router.navigate(['../detail', this.userId], {relativeTo: this.route} );
    } else {
      this.router.navigate(['../../detail', this.userId], {relativeTo: this.route} );
    }
  }

  ngOnDestroy(){
    // unsubscribe from all subscriptions
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

}
