import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionsService } from '../../transactions/transactions.service'
import { Transaction } from '../../data/data-access.model';
import { AccountsService } from '../../accounts/accounts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnDestroy {

  readonly displayedColumns: string[] = ['date', 'payee', 'amount'];
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
