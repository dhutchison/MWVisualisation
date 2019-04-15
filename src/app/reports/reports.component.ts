import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  menuItems: MenuItem[];

  constructor() {}

  ngOnInit(): void {
    this.menuItems = [
      { label: 'Cash Flow', routerLink: '/reports/cash-flow' },
      { label: 'Bucket Summary', routerLink: '/reports/bucket-summary' },
      { label: 'Transactions', routerLink: '/reports/transactions' },
      { label: 'Net Worth', routerLink: '/reports/net-worth' },
      { label: 'Income Trend', routerLink: '/reports/trends/income-trend' },
      { label: 'Expense Trend', routerLink: '/reports/trends/expense-trend' }
    ];
  }

}
