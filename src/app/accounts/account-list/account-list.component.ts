import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { AccountsService } from '../accounts.service';
import { Subscription } from 'rxjs';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit, OnDestroy {

  private accountsSub: Subscription;

  accounts: {id: number, name: string}[] = [];
  accountFound: string = "No Accounts"

  constructor(private _accountsService: AccountsService) { }

  ngOnInit() {
    this.accountsSub = this._accountsService.accounts.subscribe(
      (value: {id: number, name: string}[]) => {
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
