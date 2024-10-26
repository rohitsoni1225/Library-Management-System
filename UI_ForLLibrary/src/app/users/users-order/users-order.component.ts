import { Component } from '@angular/core';
import { Order } from '../../Models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'users-order',
  templateUrl: './users-order.component.html',
  styleUrl: './users-order.component.css'
})
export class UsersOrderComponent {
  columnsForPendingReturns: string[] = [
    'orderId',
    'bookId',
    'bookTitle',
    'orderDate',
    'fineToPay',
  ];
  columnsForCompletedReturns: string[] = [
    'orderId',
    'bookId',
    'bookTitle',
    'orderDate',
    'returnedDate',
    'finePaid',
  ];
  pendingReturns: Order[] = [];
  completedReturns: Order[] = [];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
    let userId = this.apiService.getUserInfo()!.id;
    apiService.getOrdersOfUser(userId).subscribe({
      next: (res: Order[]) => {
        this.pendingReturns = res.filter((o) => !o.returned);
        this.completedReturns = res.filter((o) => o.returned);
      },
    });
  }

  getFineToPay(order: Order) {
    return this.apiService.getFine(order);
  }
}
