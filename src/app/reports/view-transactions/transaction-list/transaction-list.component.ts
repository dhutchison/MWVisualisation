import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';

import { Subscription } from 'rxjs';

import { Transaction, Account } from 'src/app/data-access/data-access.model';
import { DataAccessService } from 'src/app/data-access/data-access.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnDestroy {

  readonly displayedColumns = [
    { field: 'date', header: 'Date' },
    { field: 'payee', header: 'Payee'},
    { field: 'amount', header: 'Amount'}];

  private _accountsSubscription: Subscription;
  private _transactions: Transaction[] = [];

  readonly accounts: Map<number, Account> = new Map();

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
  }

  ngOnDestroy() {
    this._accountsSubscription.unsubscribe();
  }

  @Input()
  set transactions(value: Transaction[]) {
    /* Ensure the supplied array is non-null */
    this._transactions = ((value) ? value : []);
  }

  get transactions(): Transaction[] {
    return this._transactions;
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
