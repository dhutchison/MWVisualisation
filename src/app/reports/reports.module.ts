import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';

import { BucketSummaryComponent } from './bucket-summary/bucket-summary.component';
import { InOutReportComponent } from './in-out-report/in-out-report.component';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { ReportsComponent } from './reports.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionFilterComponent } from './filter/transaction-filter/transaction-filter.component';
import { AccountListComponent } from './filter/accounts/account-list/account-list.component';
import { AccountsService } from './filter/accounts/accounts.service';
import { TransactionsService } from './transactions.service';
import { IncomeTrendComponent } from './income-trend/income-trend.component';
import { TrendPeriodFilterComponent } from './shared/trend-period-filter/trend-period-filter.component';
import { TrendGraphComponent } from './shared/trend-graph/trend-graph.component';
import { ExpenseTrendComponent } from './expense-trend/expense-trend.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  { path: '', component: ReportsComponent, children: [
    { path: 'cash-flow', component: InOutReportComponent },
    { path: 'bucket-summary', component: BucketSummaryComponent },
    { path: 'transactions', component: TransactionsComponent },
    { path: 'net-worth', component : NetWorthComponent },
    { path: 'income-trend', component: IncomeTrendComponent },
    { path: 'expense-trend', component: ExpenseTrendComponent }
  ]}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FormsModule,
    ReactiveFormsModule,

    /* PrimeNG components */
    CalendarModule,
    CardModule,
    ListboxModule,
    RadioButtonModule,
    TableModule,
    TabMenuModule


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
    TransactionFilterComponent,
    TransactionListComponent,
    IncomeTrendComponent,
    TrendPeriodFilterComponent,
    TrendGraphComponent,
    ExpenseTrendComponent,
    TransactionsComponent,
  ],
  providers: [
    AccountsService,
    TransactionsService
  ]
})
export class ReportsModule { }
