import { NgModule } from '@angular/core';
import { UsersOrderComponent } from './users-order/users-order.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { ApprovalRequestsComponent } from './approval-requests/approval-requests.component';
import { AllordersComponent } from './allorders/allorders.component';
import { ViewUsersComponent } from './view-users/view-users.component';



@NgModule({
  declarations: [
    UsersOrderComponent,
    ProfileComponent,
    ApprovalRequestsComponent,
    AllordersComponent,
    ViewUsersComponent
  ],
  imports: [
    SharedModule
  ]
})
export class UsersModule { }
