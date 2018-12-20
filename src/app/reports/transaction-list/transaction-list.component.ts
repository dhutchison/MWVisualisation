import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { Transaction, Account } from '../../data-access/data-access.model';
import { Subscription } from 'rxjs';

import { MatSort, MatTableDataSource } from '@angular/material';
import { DataAccessService } from 'src/app/data-access/data-access.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnDestroy {

  readonly displayedColumns: string[] = ['date', 'payee', 'amount'];

  private _accountsSubscription: Subscription;
  private _transactions: Transaction[] = [];

  readonly accounts: Map<number, Account> = new Map();

  dataSource = new MatTableDataSource(this._transactions);
  selection = new SelectionModel<Transaction>(false, [], true);

  @ViewChild(MatSort) sort: MatSort;

  constructor(
      private dataAccessService: DataAccessService
    ) { }

  ngOnInit() {

    this._accountsSubscription = this.dataAccessService.accounts.subscribe(
      (accounts) => {
        this.accounts.clear();
        accounts.forEach((value) => this.accounts.set(value.id, value));
      }
    );

    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this._accountsSubscription.unsubscribe();
  }

  @Input()
  set transactions(value: Transaction[]) {
    /* Ensure the supplied array is non-null */
    this._transactions = ((value) ? value : []);
    /* Set the datasource for the table */
    this.dataSource.data = this._transactions;
  }

  getCurrency(transaction?: Transaction): string {

    let currencyCode: string;
    if (transaction) {
      /* Transaction argument was supplied, get the appropriate code for the account */
      currencyCode = this.accounts.get(transaction.accountId).currencyCode;
    } else {
      /* No transaction applied, default to the first accout in the map */
      const account = this.accounts.get(this.accounts.keys().next().value);
      if (account) {
        /* If there are any accounts loaded */
        currencyCode = account.currencyCode;
      }
    }

    return currencyCode;
  }

  getTotal(): number {

    return this._transactions
      .map(t => t.amount)
      .reduce((total, value) => total + value, 0);
  }
}
