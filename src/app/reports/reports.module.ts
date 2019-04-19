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
import { ReportsComponent } from './reports.component';
import { TransactionFilterComponent } from './filter/transaction-filter/transaction-filter.component';
import { AccountListComponent } from './filter/accounts/account-list/account-list.component';
import { AccountsService } from './filter/accounts/accounts.service';
import { TransactionsService } from './transactions.service';
import { TrendsModule } from './trends/trends.module';

const routes: Routes = [
  { path: '', component: ReportsComponent, children: [
    { path: 'cash-flow', component: InOutReportComponent },
    { path: 'bucket-summary', component: BucketSummaryComponent },
    { path: 'transactions', 
      loadChildren: './view-transactions/view-transactions.module#ViewTransactionsModule' },
    { path: 'trends', loadChildren: './trends/trends.module#TrendsModule' }
  ]}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FormsModule,
    ReactiveFormsModule,

    TrendsModule,

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
    ReportsComponent,
    TransactionFilterComponent,
  ],
  providers: [
    AccountsService,
    TransactionsService
  ]
})
export class ReportsModule { }
