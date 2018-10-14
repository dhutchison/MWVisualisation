import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';

import { NgxElectronModule } from 'ngx-electron';

import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';

import { 
    MatListModule,
    MatGridListModule,
    MatTabsModule,
    MatToolbarModule
  } from '@angular/material';

import { AppComponent } from './app.component';
import { TransactionListComponent } from './transactions/transaction-list/transaction-list.component';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { AccountsService } from './accounts/accounts.service';
import { TransactionsService } from './transactions/transactions.service';
import { TransactionFilterComponent } from './transactions/transaction-filter/transaction-filter.component';
import { AppRoutingModule } from './app-routing.module';
import { SplashComponent } from './splash/splash.component';
import { ReportsComponent } from './reports/reports.component';
import { InOutReportComponent } from './reports/in-out-report/in-out-report.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionListComponent,
    AccountListComponent,
    TransactionFilterComponent,
    SplashComponent,
    ReportsComponent,
    InOutReportComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    NgxElectronModule,

    /* Material date range picker component */
    NgxMatDrpModule,

    /* Angular Material Components */
    MatListModule,
    MatGridListModule,
    MatTabsModule,
    MatToolbarModule,

    /* Routing support */
    AppRoutingModule
  ],
  providers: [
    AccountsService, 
    TransactionsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
