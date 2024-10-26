import { Routes } from '@angular/router';
import { PageNotfoundComponent } from './shared/components/page-notfound/page-notfound.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { BookStoreComponent } from './books/book-store/book-store.component';
import { UsersOrderComponent } from './users/users-order/users-order.component';
import { ProfileComponent } from './users/profile/profile.component';
import { MaintenanceComponent } from './books/maintenance/maintenance.component';
import { ReturnbookComponent } from './books/returnbook/returnbook.component';
import { ApprovalRequestsComponent } from './users/approval-requests/approval-requests.component';
import { AllordersComponent } from './users/allorders/allorders.component';
import { ViewUsersComponent } from './users/view-users/view-users.component';

export const routes: Routes = [
    {path:"register", component:RegisterComponent},
    {path:"login", component:LoginComponent},
    {path: "home",component: BookStoreComponent },
    {path: "my-orders",component: UsersOrderComponent },
    {path: "profile",component: ProfileComponent },
    {path: "maintenance",component: MaintenanceComponent },
    {path: "return-book",component: ReturnbookComponent },
    {path: "approval-requests",component: ApprovalRequestsComponent },
    {path: "all-orders",component: AllordersComponent },
    {path: "view-users",component: ViewUsersComponent },
    {path:"**", component:PageNotfoundComponent},
];
