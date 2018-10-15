import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { AccountsService } from '../accounts.service';
import { Subscription } from 'rxjs';
import { MatSelectionListChange } from '@angular/material/list';
import { Account } from '../../data/data-access.model';
import { DataAccessService } from '../../data/data-access.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit, OnDestroy {

  private accountsSub: Subscription;

  accounts: Account[] = [];
  accountFound: string = "No Accounts"

  constructor(
    private _accountsService: AccountsService,
    private _dataAccessService: DataAccessService
    ) { }

  ngOnInit() {
    this.accountsSub = this._dataAccessService.accounts.subscribe(
      (value: Account[]) => {
        this.accounts = value;
        this.accountFound = "Got Accounts";
        console.log("Got accounts");
        console.log(this.accounts);
      }
    );
  }

  onSelectionChanged(event: MatSelectionListChange): void {

    let selectedAccounts = [];

    event.source.selectedOptions.selected.forEach(element => {
      console.log(element.value);
      selectedAccounts.push(element.value);
    });

    this._accountsService.selectedAccounts = selectedAccounts;
  }

  ngOnDestroy() {
    this.accountsSub.unsubscribe();
  }

}
