import { Injectable } from '@angular/core';
import { InOutSummary, Transaction, TransactionFilter, DailyWorth } from '../data-access/data-access.model';

import { BehaviorSubject } from 'rxjs';

import { AccountsService } from './filter/accounts/accounts.service';
import { DataAccessService } from '../data-access/data-access.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  readonly transactions = new BehaviorSubject<Transaction[]>([]);
  readonly accountInOutSummary = new BehaviorSubject<InOutSummary[]>([]);
  readonly bucketInOutSummary = new BehaviorSubject<InOutSummary[]>([]);

  /* Date ranges are yyyyMMdd strings */
  private _filter: TransactionFilter = {};

  constructor(
    private _accountsService: AccountsService,
    private _dataAccessService: DataAccessService) {

    /* Subscribe to changes in the accounts selected */
    this._accountsService.selectedAccountsSubject.subscribe((value) => {
      console.log('Transaction service sees accounts');
      console.log(value);
      this._filter.accounts = value;
      this.reloadTransactions();
    });
  }

  set dateRange(date: {fromDate: Date, toDate: Date}) {

    const filterRange = {
      start: this.getDateString(date.fromDate),
      end: this.getDateString(date.toDate)
    };

    this._filter.dateRange = filterRange;

    this.reloadTransactions();
  }

  private getDateString(input: Date): string {
    /* Need to handle timezones too.
    * Based on answer and comments to
    * https://stackoverflow.com/a/16714931/230449 */
    const workingDate = new Date(input);
    workingDate.setMinutes(workingDate.getMinutes() - workingDate.getTimezoneOffset());
    return workingDate.toISOString().slice(0, 10).replace(/-/g, '');
  }

  /**
   * Reload the transaction data via the data access service
   *
   * TODO: Refactor to split work
   */
  private reloadTransactions(): void {

    console.log(this._filter);

    this._dataAccessService.loadTransactions(this._filter)
      .then((result) => {
        this.transactions.next(result);
      });

    this._dataAccessService.loadAccountInOutSummary(this._filter)
      .then((result) => {
        this.accountInOutSummary.next(result);
      });

    this._dataAccessService.loadBucketInOutSummary(this._filter)
      .then((result) => {
        this.bucketInOutSummary.next(result);
      });
  }
}
