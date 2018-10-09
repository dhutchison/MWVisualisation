import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  accounts = new Subject<{id: number, name: string}[]>();

  constructor(
      private _electronService: ElectronService, 
      private _ngZone: NgZone) { 

    this._electronService.ipcRenderer.on(
      "accountsLoaded", (event: any, arg: any) => {
        console.log("Account Service got:")
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
}
