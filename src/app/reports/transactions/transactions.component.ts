import { Component, OnInit, OnDestroy } from '@angular/core';
import { Account, Transaction } from 'src/app/data-access/data-access.model';
import { Subscription } from 'rxjs';
import { TransactionsService } from '../transactions.service';
import { AccountsService } from '../filter/accounts/accounts.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  transactions: Transaction[] = [];

  readonly accounts: Map<number, Account> = new Map();

  private _accountsSubscription: Subscription;
  private _transactionsSubscription: Subscription;

  constructor(
    private _transactionService: TransactionsService,
    private _accountsService: AccountsService) { }

  ngOnInit() {

    this._accountsSubscription = this._accountsService.selectedAccountsSubject.subscribe(
      (accounts) => {
        /* Could clear the existing values, but we are not too bothered if this holds more values */
        accounts.forEach((value) => this.accounts.set(value.id, value));
      }
    );

    this._transactionsSubscription = this._transactionService.transactions.subscribe(
      (transactions) => {
        this.transactions = transactions;
      });
  }

  ngOnDestroy() {
    this._transactionsSubscription.unsubscribe();
  }

}
