import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Account } from '../data/data-access.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private _selectedAccounts: Account[];

  readonly selectedAccountsSubject = new BehaviorSubject<Account[]>([]);

  constructor() { 

  }

  get selectedAccounts(): Account[] {
    return this._selectedAccounts;
  }

  set selectedAccounts(value: Account[]) {
    console.log("Setting selected accounts in service");
    this._selectedAccounts = value;
    this.selectedAccountsSubject.next(this._selectedAccounts);
  }
}
