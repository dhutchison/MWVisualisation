import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { NgxElectronModule } from 'ngx-electron';

import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';

import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';

import { AppComponent } from './app.component';
import { TransactionListComponent } from './transactions/transaction-list/transaction-list.component';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { AccountsService } from './accounts/accounts.service';
import { TransactionsService } from './transactions/transactions.service';
import { TransactionFilterComponent } from './transactions/transaction-filter/transaction-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionListComponent,
    AccountListComponent,
    TransactionFilterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxElectronModule,

    /* Material date range picker component */
    NgxMatDrpModule,

    /* Angular Material Components */
    MatListModule,
    MatGridListModule
  ],
  providers: [
    AccountsService, 
    TransactionsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
