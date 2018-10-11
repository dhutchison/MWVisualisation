import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionsService } from '../transactions.service'
import { Transaction } from '../shared/transaction.model';
import { AccountsService } from '../../accounts/accounts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnDestroy {

  transactions: Transaction[];

  private _transactionsSubscription: Subscription;

  constructor(
    private _transactionService: TransactionsService) { }

  ngOnInit() {
    
    this._transactionsSubscription = this._transactionService.transactions.subscribe(
      transactions => this.transactions = transactions);
  }

  ngOnDestroy() {
    this._transactionsSubscription.unsubscribe();
  }



}
