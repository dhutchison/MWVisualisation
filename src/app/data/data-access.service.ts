import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';

import { TransactionFilter, Transaction } from './data-access.model'

@Injectable({
  providedIn: 'root'
})
/**
 * Service which acts as a single point for communicating with the electron backend.
 */
export class DataAccessService {

  readonly fileOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);

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
  }

  loadTransactions(filter: TransactionFilter): Promise<Transaction[]> {
    return new Promise<Transaction[]>((resolve, reject) => {
      let result = this._electronService.ipcRenderer.sendSync("loadTransactions", filter);
      // this._ngZone.run(() => {
        resolve(result);
      // });
    });
  }


}
