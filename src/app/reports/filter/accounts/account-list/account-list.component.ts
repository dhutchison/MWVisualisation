import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { AccountsService } from '../accounts.service';
import { Subscription } from 'rxjs';
import { Account, AccountType } from '../../../../data-access/data-access.model';
import { DataAccessService } from '../../../../data-access/data-access.service';

import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit, OnDestroy {

  private accountsSub: Subscription;

  accounts: SelectItem[] = [];
  accountFound = 'No Accounts';

  private privSelectedAccounts: Account[] = [];

  constructor(
    private _accountsService: AccountsService,
    private _dataAccessService: DataAccessService
    ) { }

  ngOnInit() {
    this.accountsSub = this._dataAccessService.accounts.subscribe(
      (value: Account[]) => {

        const newAccounts = [];
        value.forEach(account => {
          const selectItem: SelectItem = {
            label: account.name,
            icon: this.getIconName(account),
            value: account
          };
          newAccounts.push(selectItem);
        });

        this.accounts = newAccounts;
        this.accountFound = 'Got Accounts';
        console.log(this.accountFound);
        console.log(this.accounts);
      }
    );
  }

  get selectedAccounts(): Account[] {
    return this.privSelectedAccounts;
  }

  set selectedAccounts(value: Account[]) {
    this.privSelectedAccounts = value;

    this._accountsService.selectedAccounts = this.privSelectedAccounts;
  }

  getIconName(account: Account): string {

    let iconName: string;

    if (account.type === AccountType.Credit) {
      iconName = 'credit_card';
    } else if (account.type === AccountType.Checking) {
      iconName = 'account_balance';
    } else if (account.type === AccountType.Investment || account.type === AccountType.MoneyMarket) {
      iconName = 'trending_up';
    } else if (account.type === AccountType.Loan) {
      iconName = 'trending_down';
    } else {
      iconName = 'account_balance_wallet';
    }

    return iconName;
  }

  ngOnDestroy() {
    this.accountsSub.unsubscribe();
  }

}
