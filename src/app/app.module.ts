import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';

import { NgxElectronModule } from 'ngx-electron';

import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';

import { 
    MatListModule,
    MatGridListModule,
    MatIconModule, 
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule
  } from '@angular/material';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { AccountsService } from './accounts/accounts.service';
import { ReportsComponent } from './reports/reports.component';
import { InOutReportComponent } from './reports/in-out-report/in-out-report.component';
import { TransactionListComponent } from './reports/transaction-list/transaction-list.component';
import { SplashComponent } from './splash/splash.component';
import { TransactionsService } from './transactions/transactions.service';
import { TransactionFilterComponent } from './transactions/transaction-filter/transaction-filter.component';
import { BucketSummaryComponent } from './reports/bucket-summary/bucket-summary.component';
import { NetWorthComponent } from './reports/net-worth/net-worth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionEditorComponent } from './transactions/transaction-editor/transaction-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionListComponent,
    AccountListComponent,
    TransactionFilterComponent,
    SplashComponent,
    ReportsComponent,
    InOutReportComponent,
    BucketSummaryComponent,
    NetWorthComponent,
    TransactionEditorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    NgxElectronModule,
    ReactiveFormsModule,

    /* Material date range picker component */
    NgxMatDrpModule,

    /* Angular Material Components */
    MatCheckboxModule,
    MatDatepickerModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
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
