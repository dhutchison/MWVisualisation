import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';

import {
    Account,
    InOutSummary,
    TransactionFilter,
    Transaction,
    TimePeriod,
    TrendData,
    TrendFilter} from './data-access.model';

@Injectable({
  providedIn: 'root'
})
/**
 * Service which acts as a single point for communicating with the electron backend.
 */
export class DataAccessService {

  readonly fileOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  readonly accounts = new BehaviorSubject<Account[]>([]);

  constructor(
    private _electronService: ElectronService,
    private _ngZone: NgZone
  ) {
    /* When a file is opened, pass this information on to subscribers */
    this._electronService.ipcRenderer.on('databaseOpened',
      () => {
        this._ngZone.run(() => {
          this.fileOpen.next(true);
        });
      });

    this._electronService.ipcRenderer.on(
      'accountsLoaded', (event: any, arg: any) => {
        console.log('data access service got:');
        console.log(event);
        console.log(arg);

        /* Need to force this in to the Angular context
         * See sample project referenced in
         * https://github.com/ThorstenHans/ngx-electron/issues/2
         */
        this._ngZone.run(() => {
          this.accounts.next(arg);
        });

      });
  }

  loadTransactions(filter: TransactionFilter): Promise<Transaction[]> {
    return new Promise<Transaction[]>((resolve, reject) => {
      const result = this._electronService.ipcRenderer.sendSync('loadTransactions', filter);
      resolve(result);
    });
  }

  loadIncomeTrend(trendFilter: TrendFilter): Promise<TrendData[]> {
    return this.loadBucketTrend(trendFilter, 'loadIncomeTrend');
  }

  loadExpenseTrend(trendFilter: TrendFilter): Promise<TrendData[]> {
    return this.loadBucketTrend(trendFilter, 'loadExpenseTrend');
  }

  private loadBucketTrend(trendFilter: TrendFilter, serviceMethod: string): Promise<TrendData[]> {
    return new Promise<TrendData[]>((resolve, reject) => {
      const result = this._electronService.ipcRenderer.sendSync(serviceMethod, trendFilter);
      resolve(result);
    });
  }

  loadAccountInOutSummary(filter: TransactionFilter): Promise<InOutSummary[]> {
    return this.loadInOutSummary(filter, 'loadAccountInOutSummary');
  }

  loadBucketInOutSummary(filter: TransactionFilter): Promise<InOutSummary[]> {
    return this.loadInOutSummary(filter, 'loadBucketInOutSummary');
  }

  private loadInOutSummary(filter: TransactionFilter, dataLoadCommand: string):
    Promise<InOutSummary[]> {

    return new Promise<InOutSummary[]>((resolve, reject) => {
      const result = this._electronService.ipcRenderer.sendSync(dataLoadCommand, filter);
      resolve(result);
    });

  }

  loadDailyTrend(filter: TransactionFilter): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const result = this._electronService.ipcRenderer.sendSync('loadDailyAccountBalances', filter);
      resolve(result);
    });
  }


}
