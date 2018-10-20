import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { TransactionsService } from '../../transactions/transactions.service'
import { Transaction } from '../../data/data-access.model';
import { Subscription } from 'rxjs';

import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnDestroy {

  readonly displayedColumns: string[] = ['date', 'payee', 'amount'];
  transactions: Transaction[] = [];

  dataSource = new MatTableDataSource(this.transactions);
  selection = new SelectionModel<Transaction>(true, []);

  @ViewChild(MatSort) sort: MatSort;

  private _transactionsSubscription: Subscription;

  constructor(
    private _transactionService: TransactionsService) { }

  ngOnInit() {
    
    this.dataSource.sort = this.sort;

    this._transactionsSubscription = this._transactionService.transactions.subscribe(
      (transactions) => {
        this.transactions = transactions;
        this.dataSource.data = this.transactions;
      });
  }

  ngOnDestroy() {
    this._transactionsSubscription.unsubscribe();
  }

  getTotal(): number {

    return this.transactions
      .map(t => t.amount)
      .reduce((total, value) => total + value, 0);
  }



}
