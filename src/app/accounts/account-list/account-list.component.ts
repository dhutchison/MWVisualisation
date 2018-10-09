import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { AccountsService } from '../accounts.service';
import { Subscription } from 'rxjs';

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

  ngOnDestroy() {
    this.accountsSub.unsubscribe();
  }

}
