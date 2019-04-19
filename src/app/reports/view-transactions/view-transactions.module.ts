import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';

import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { TransactionsService } from './services/transactions.service';

const routes: Routes = [
  { path: '', component: TransactionsComponent }
];

@NgModule({
  declarations: [
    TransactionsComponent,
    TransactionFilterComponent,
    TransactionListComponent
  ],
  providers: [
    TransactionsService
  ],
  imports: [
    CommonModule,
    FormsModule,

    RouterModule.forChild(routes),

    CalendarModule,
    FieldsetModule,
    MultiSelectModule,
    TableModule
  ],
  exports: [
    RouterModule
  ]
})
export class ViewTransactionsModule { }
