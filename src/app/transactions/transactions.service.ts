import { Injectable, NgZone } from '@angular/core';
import { Transaction } from '../data/data-access.model';

import { BehaviorSubject } from 'rxjs';

import { ElectronService } from 'ngx-electron';
import { AccountsService } from '../accounts/accounts.service';
import { InOutSummary } from '../reports/in-out-report/shared/in-out.model';
import { DataAccessService } from '../data/data-access.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  readonly transactions = new BehaviorSubject<Transaction[]>([]);
  readonly inOutSummary = new BehaviorSubject<InOutSummary[]>([]);

  /* Date ranges are yyyyMMdd strings */
  private _filter: {
      dateRange?: { start: string, end: string },
      accounts?: { id: number, name: string }[]
    } = {}

  constructor(
    private _accountsService: AccountsService,
    private _dataAccessService: DataAccessService) { 
    
    /* Subscribe to changes in the accounts selected */
    this._accountsService.selectedAccountsSubject.subscribe((value) => {
      console.log("Transaction service sees accounts");
      console.log(value);
      this._filter.accounts = value;
      this.reloadTransactions()
    });
  }

  set dateRange(date: {fromDate: Date, toDate: Date}) {
    
    let filterRange = {
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
    let workingDate = new Date(input);
    workingDate.setMinutes(workingDate.getMinutes() - workingDate.getTimezoneOffset()); 
    return workingDate.toISOString().slice(0,10).replace(/-/g,"");
  }

  /**
   * Asyncronously reloads the transactions. 
   * 
   * Result will come in through an event from the electron service.
   */
  private reloadTransactions(): void {

    console.log(this._filter);

    this._dataAccessService.loadTransactions(this._filter)
      .then((result) => {
        this.transactions.next(result);
      });

    this._dataAccessService.loadAccountInOutSummary(this._filter)
      .then((result) => {
        this.inOutSummary.next(result);
      });
  }
}
