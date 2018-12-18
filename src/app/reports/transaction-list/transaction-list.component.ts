import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { TransactionsService } from '../transactions.service';
import { Transaction, Account } from '../../data-access/data-access.model';
import { Subscription } from 'rxjs';

import { MatSort, MatTableDataSource } from '@angular/material';
import { AccountsService } from '../filter/accounts/accounts.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnDestroy {

  readonly displayedColumns: string[] = ['date', 'payee', 'amount'];
  transactions: Transaction[] = [];

  readonly accounts: Map<number, Account> = new Map();

  dataSource = new MatTableDataSource(this.transactions);
  selection = new SelectionModel<Transaction>(false, [], true);

  @ViewChild(MatSort) sort: MatSort;

  private _accountsSubscription: Subscription;
  private _transactionsSubscription: Subscription;

  constructor(
    private _transactionService: TransactionsService,
    private _accountsService: AccountsService) { }

  ngOnInit() {

    this.dataSource.sort = this.sort;

    this._accountsSubscription = this._accountsService.selectedAccountsSubject.subscribe(
      (accounts) => {
        /* Could clear the existing values, but we are not too bothered if this holds more values */
        accounts.forEach((value) => this.accounts.set(value.id, value));
      }
    );

    this._transactionsSubscription = this._transactionService.transactions.subscribe(
      (transactions) => {
        this.transactions = transactions;
        this.dataSource.data = this.transactions;
      });
  }

  ngOnDestroy() {
    this._transactionsSubscription.unsubscribe();
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

    return this.transactions
      .map(t => t.amount)
      .reduce((total, value) => total + value, 0);
  }



}
