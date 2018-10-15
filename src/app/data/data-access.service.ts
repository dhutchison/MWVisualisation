import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';

import { 
    Account,
    TransactionFilter, 
    Transaction } from './data-access.model'
import { InOutSummary } from '../reports/shared/in-out.model';
import { resolve } from 'dns';

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
    private _electronService : ElectronService,
    private _ngZone: NgZone
  ) { 
    /* When a file is opened, pass this information on to subscribers */
    this._electronService.ipcRenderer.on("databaseOpened", 
      () => {
        this._ngZone.run(() => {
          this.fileOpen.next(true)
        });
      });

    this._electronService.ipcRenderer.on(
      "accountsLoaded", (event: any, arg: any) => {
        console.log("data access service got:")
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
      let result = this._electronService.ipcRenderer.sendSync("loadTransactions", filter);
      resolve(result);
    });
  }

  loadAccountInOutSummary(filter: TransactionFilter): Promise<InOutSummary[]> {
    return new Promise<InOutSummary[]>((resolve, reject) => {
      let result = this._electronService.ipcRenderer.sendSync("loadAccountInOutSummary", filter);
      resolve(result);
    });
  }

  loadBucketInOutSummary(filter: TransactionFilter): Promise<InOutSummary[]> {
    return new Promise<InOutSummary[]>((resolve, reject) => {
      let result = this._electronService.ipcRenderer.sendSync("loadBucketInOutSummary", filter);
      resolve(result);
    });
  }


}
