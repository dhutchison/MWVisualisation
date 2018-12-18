import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import {
    Account,
    TransactionStatus,
    TransactionType,
    Transaction
  } from 'src/app/data-access/data-access.model';
import { DataAccessService } from 'src/app/data-access/data-access.service';

@Component({
  selector: 'app-transaction-editor',
  templateUrl: './transaction-editor.component.html',
  styleUrls: ['./transaction-editor.component.css']
})
export class TransactionEditorComponent implements OnInit, OnDestroy {

  transactionForm = new FormGroup({
    payee: new FormControl(''),
    date: new FormControl(''),
    type: new FormControl(''),
    amount: new FormControl(''),
    bucket: new FormControl(''),
    memo: new FormControl(''),
    tags: new FormControl(''),
    status: new FormControl(''),
    accountId: new FormControl(''),
    transferToAccountId: new FormControl(''),
    // TODO: Missing attachments

  });

  private accountsSub: Subscription;
  private _transaction: Transaction;

  accounts: Account[] = [];

  constructor(
    private _dataAccessService: DataAccessService
    ) { }

  ngOnInit() {
    this.accountsSub = this._dataAccessService.accounts.subscribe(
      (value: Account[]) => {
        this.accounts = value;
      }
    );
  }

  ngOnDestroy() {
    this.accountsSub.unsubscribe();
  }

  getTransactionTypes(): string[] {
    return Object.keys(TransactionType).filter(k => typeof TransactionType[k as any] === 'number');
  }

  getStatuses(): string[] {
    return Object.keys(TransactionStatus).filter(k => typeof TransactionStatus[k as any] === 'number');
  }

}
