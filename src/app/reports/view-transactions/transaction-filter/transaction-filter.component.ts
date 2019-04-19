import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';

import { DataAccessService } from 'src/app/data-access/data-access.service';
import { Account, AccountType, TransactionFilter } from 'src/app/data-access/data-access.model';
import { TransactionsService } from '../services/transactions.service';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.css']
})
export class TransactionFilterComponent implements OnInit, OnDestroy {

  accounts: SelectItem[] = [];

  transactionFilter: TransactionFilter;

  private accountsSub: Subscription;
  private privSelectedAccounts: Account[] = [];

  private dateRange: Date[] = [this.backDate(30), new Date()];
  presets = [];

  constructor(
    private _transactionsService: TransactionsService,
    private _dataAccessService: DataAccessService) { }

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
        console.log(this.accounts);
      }
    );

    this.setupPresets();
  }

  ngOnDestroy() {
    this.accountsSub.unsubscribe();
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

  get selectedAccounts(): Account[] {
    return this.privSelectedAccounts;
  }

  set selectedAccounts(value: Account[]) {
    this.privSelectedAccounts = value;

    this.setTransactionFilter();
  }

  get rangeDates() {
    return this.dateRange;
  }

  // handler function that receives the updated date range object
  set rangeDates(range: Date[]) {
    this.dateRange = range;
    console.log('Got Range');
    console.log(this.dateRange);

    this.setTransactionFilter();
  }

  private setTransactionFilter() {

    this.transactionFilter = {
      dateRange: {
        start: this.getDateString(this.dateRange[0]),
        end: this.getDateString(this.dateRange[1])
      },
      accounts: this.selectedAccounts
    };

    this._transactionsService.filter = this.transactionFilter;

  }

  private getDateString(input: Date): string {
    /* Need to handle timezones too.
    * Based on answer and comments to
    * https://stackoverflow.com/a/16714931/230449 */
    const workingDate = new Date(input);
    workingDate.setMinutes(workingDate.getMinutes() - workingDate.getTimezoneOffset());
    return workingDate.toISOString().slice(0, 10).replace(/-/g, '');
  }

  private backDate(numOfDays: number): Date {
    const today = new Date();
    return new Date(today.setDate(today.getDate() - numOfDays));
  }

  // helper function to create initial presets
  setupPresets() {
    const today = new Date();
    const yesterday = this.backDate(1);
    const minus7 = this.backDate(7);
    const minus30 = this.backDate(30);
    const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    this.presets =  [
      {
        presetLabel: 'Yesterday', range: { fromDate: yesterday, toDate: today }
      },
      {
        presetLabel: 'Last 7 Days', range: { fromDate: minus7, toDate: today }
      },
      {
        presetLabel: 'Last 30 Days', range: { fromDate: minus30, toDate: today }
      },
      {
        presetLabel: 'This Month', range: { fromDate: currMonthStart, toDate: currMonthEnd }
      },
      {
        presetLabel: 'Last Month', range: { fromDate: lastMonthStart, toDate: lastMonthEnd }
      }
    ];
  }
}
