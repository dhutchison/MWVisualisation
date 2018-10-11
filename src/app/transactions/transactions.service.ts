import { Injectable, NgZone } from '@angular/core';
import { Transaction } from './shared/transaction.model';

import { Observable, of, BehaviorSubject } from 'rxjs';

import { ElectronService } from 'ngx-electron';
import { AccountsService } from '../accounts/accounts.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  readonly transactions = new BehaviorSubject<Transaction[]>([]);

  /* Date ranges are yyyyMMdd strings */
  private _filter: {
      dateRange?: { start: string, end: string },
      accounts?: { id: number, name: string }[]
    } = {}

  constructor(
    private _accountsService: AccountsService,
    private _electronService: ElectronService,
    private _ngZone: NgZone) { 
    
    /* Subscribe to changes in the accounts selected */
    this._accountsService.selectedAccountsSubject.subscribe((value) => {
      console.log("Transaction service sees accounts");
      console.log(value);
      this._filter.accounts = value;
      this.reloadTransactions()
    });

    /* Subscribe to the notification from electron that transactions have been loaded */
    this._electronService.ipcRenderer.on("transactionsLoaded", 
      (event: any, args: Transaction[]) => {

        /* Need to force this in to the Angular context
         * See sample project referenced in 
         * https://github.com/ThorstenHans/ngx-electron/issues/2
         */
        this._ngZone.run(() => {
          this.transactions.next(args);
        });
        
      }
    );
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

    /* Send a notification to the electron service to service the request */
    this._electronService.ipcRenderer.send("loadTransactions", this._filter);
  }

  getTransactions(): Observable<Transaction[]> {

    // let statement = this.db.prepare("SELECT Z_PK, ZDATEYMD, ZAMOUNT, ZPAYEE FROM ZACTIVITY");
    // statement.bind()

    // let transactions: Transaction[] = [];
    // while (statement.step()) {
    //   let row = statement.getAsObject();

    //   transactions.push({id: row.Z_PK, date: new Date(row.ZDATEYMD), payee: row.ZPAYEE});
    // }


    

    let transactions: Transaction[] = [
      { id: 1, date: new Date(2018, 10, 1), payee: 'Somebody'}
    ];

    return of(transactions);
  }
}
