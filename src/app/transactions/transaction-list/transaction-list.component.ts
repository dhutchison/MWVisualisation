import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../transactions.service'
import { Transaction } from '../shared/transaction.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {

  transactions: Transaction[];

  constructor(private transactionService: TransactionsService) { }

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe(
      transactions => this.transactions = transactions);
  }

}
