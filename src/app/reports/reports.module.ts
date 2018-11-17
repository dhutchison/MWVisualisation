import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

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
    MatCheckboxModule, MatButtonModule, MatSidenavModule
  } from '@angular/material';

import { BucketSummaryComponent } from './bucket-summary/bucket-summary.component';
import { InOutReportComponent } from './in-out-report/in-out-report.component';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { ReportsComponent } from './reports.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionFilterComponent } from './filter/transaction-filter/transaction-filter.component';
import { AccountListComponent } from './filter/accounts/account-list/account-list.component';
import { TransactionEditorComponent } from './transaction-list/transaction-editor/transaction-editor.component';
import { AccountsService } from './filter/accounts/accounts.service';
import { TransactionsService } from './transactions.service';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ReportsComponent, children: [
    { path: 'cash-flow', component: InOutReportComponent },
    { path: 'bucket-summary', component: BucketSummaryComponent },
    { path: 'transactions', component: TransactionListComponent },
    { path: 'net-worth', component : NetWorthComponent }
  ]}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    ReactiveFormsModule,

    /* Material date range picker component */
    NgxMatDrpModule,

    /* Angular Material Components */
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
  ],
  exports: [
    RouterModule,
    ReportsComponent
  ],
  declarations: [
    AccountListComponent,
    BucketSummaryComponent, 
    InOutReportComponent,
    NetWorthComponent,
    ReportsComponent,
    TransactionEditorComponent,
    TransactionFilterComponent,
    TransactionListComponent,
  ], 
  providers: [
    AccountsService, 
    TransactionsService
  ]
})
export class ReportsModule { }