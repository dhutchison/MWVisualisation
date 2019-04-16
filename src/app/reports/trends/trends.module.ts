import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IncomeTrendComponent } from './income-trend/income-trend.component';
import { ExpenseTrendComponent } from './expense-trend/expense-trend.component';
import { TrendGraphComponent } from './shared/trend-graph/trend-graph.component';
import { TrendPeriodFilterComponent } from './shared/trend-period-filter/trend-period-filter.component';

import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { NetWorthTrendComponent } from './net-worth-trend/net-worth-trend.component';

const routes: Routes = [
  { path: 'income-trend', component: IncomeTrendComponent },
  { path: 'expense-trend', component: ExpenseTrendComponent },
  { path: 'net-worth-trend', component: NetWorthTrendComponent }
];

@NgModule({
  declarations: [
    ExpenseTrendComponent,
    IncomeTrendComponent,
    TrendGraphComponent,
    TrendPeriodFilterComponent,
    NetWorthTrendComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    /* PrimeNG Components */
    CalendarModule,
    CardModule,
    DropdownModule,
    FieldsetModule
  ],
  exports: [
    RouterModule,

    ExpenseTrendComponent,
    IncomeTrendComponent
  ]
})
export class TrendsModule { }
