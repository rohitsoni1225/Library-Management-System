import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersOrderComponent } from './users-order.component';

describe('UsersOrderComponent', () => {
  let component: UsersOrderComponent;
  let fixture: ComponentFixture<UsersOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
