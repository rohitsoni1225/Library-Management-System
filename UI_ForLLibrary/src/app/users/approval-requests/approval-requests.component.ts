import { Component, Input } from '@angular/core';
import { AccountStatus, User } from '../../Models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'approval-requests',
  templateUrl: './approval-requests.component.html',
  styleUrl: './approval-requests.component.css'
})
export class ApprovalRequestsComponent {
  column: string[]=['userId','userName','email','userType','createdOn','approve'];
  users:User[]=[];

  constructor(private apiService: ApiService ,private snackBar:MatSnackBar) {
    apiService.getUsers().subscribe({
      next: (res:User[])=>{
        this.users=res.filter((r)=>r.accountStatus==AccountStatus.UNAPPROVED);
      }
    })
  
  }
  approve(user:User){
    this.apiService.approveRequest(user.id).subscribe({
    next: (res) => {
      if (res === 'approved') {
        this.snackBar.open(`Approved for ${user.id}`, 'OK');
      } else this.snackBar.open(`Not Approved`, 'OK');
    },
  });
  }
  
}
