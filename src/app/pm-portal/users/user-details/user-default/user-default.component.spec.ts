import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDefaultComponent } from './user-default.component';

describe('UserDefaultComponent', () => {
  let component: UserDefaultComponent;
  let fixture: ComponentFixture<UserDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
