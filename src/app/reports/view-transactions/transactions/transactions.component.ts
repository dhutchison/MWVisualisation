import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransactionsService } from '../services/transactions.service';
import { Account, Transaction } from 'src/app/data-access/data-access.model';
import { AccountsService } from 'src/app/reports/filter/accounts/accounts.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  transactions: Transaction[] = [];

  private _transactionsSubscription: Subscription;

  constructor(
    private _transactionService: TransactionsService) { }

  ngOnInit() {


    this._transactionsSubscription = this._transactionService.transactions.subscribe(
      (transactions) => {
        this.transactions = transactions;
      });
  }

  ngOnDestroy() {
    this._transactionsSubscription.unsubscribe();
  }

}
