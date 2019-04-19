import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Transaction, TransactionFilter } from 'src/app/data-access/data-access.model';
import { DataAccessService } from 'src/app/data-access/data-access.service';

@Injectable()
export class TransactionsService {

  readonly transactions = new BehaviorSubject<Transaction[]>([]);

  private _filter: TransactionFilter = {};

  constructor(
    private _dataAccessService: DataAccessService) {
  }

  /**
   * Reload the transaction data via the data access service
   */
  set filter(filter: TransactionFilter) {

    this._filter = filter;
    console.log(this._filter);

    this._dataAccessService.loadTransactions(this._filter)
      .then((result) => {
        this.transactions.next(result);
      });
  }
}
