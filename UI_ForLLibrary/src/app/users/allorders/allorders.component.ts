import { Component } from '@angular/core';
import { Order } from '../../Models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'allorders',
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css'
})
export class AllordersComponent {
  showProgressBar : boolean=false;
  constructor(private apiService:ApiService , private snackBar:MatSnackBar) {
    apiService.getOrders().subscribe({
      next: (res:Order[])=>{
         this.ordersWithPendingReturns=res.filter(o=>!o.returned)
         this.ordersWithCompletedReturns=res.filter(o=>o.returned)
      },
      error:(err)=>{
        this.snackBar.open('No Orders Found','Ok')
      }
    })
    
  }
  columnsForPendingReturns: string[] = [
    'orderId',
    'userIdForOrder',
    'userNameForOrder',
    'bookId',
    'orderDate',
    'fineToPay',
  ];

  columnsForCompletedReturns: string[] = [
    'orderId',
    'userIdForOrder',
    'userNameForOrder',
    'bookId',
    'orderDate',
    'returnedDate',
    'finePaid',
  ];

  ordersWithPendingReturns: Order[] = [];
  ordersWithCompletedReturns: Order[] = [];

  sendEmail(){
this.showProgressBar=true;
this.apiService.sendEmail().subscribe({
  next:(res)=>{
    if(res==='sent'){
    this.snackBar.open('Emails have been sent to respected Students!','Ok');
    this.showProgressBar=false;
    }
    else{
      this.snackBar.open('Emails have not been sent', 'Ok');
      this.showProgressBar=false;
    }
  }
})
  }

  blockUser(){
this.apiService.blockUsers().subscribe({
  next: (res)=>{
    if(res==='blocked'){
      this.snackBar.open('Eligible Users Account were BLOCKED', 'OK');
      this.showProgressBar=false;
    }else this.snackBar.open('NOT BLOCKED', 'OK');

  }
})
  }
}
