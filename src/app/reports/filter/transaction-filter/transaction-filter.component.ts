import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../../transactions.service';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.css']
})
// TODO: This component should be a form
export class TransactionFilterComponent implements OnInit {

  private dateRange: Date[] = [this.backDate(30), new Date()];
  presets = [];

  constructor(private _transactionsService: TransactionsService) { }

  ngOnInit() {

    this.setupPresets();
  }

  // handler function that receives the updated date range object
  set range(range: Date[]) {
    this.range = range;
    console.log('Got Range');
    console.log(this.range);

    this._transactionsService.dateRange = {fromDate: range[0], toDate: range[1]};
  }

  private backDate(numOfDays: number): Date {
    const today = new Date();
    return new Date(today.setDate(today.getDate() - numOfDays));
  }

  // helper function to create initial presets
  setupPresets() {
    const today = new Date();
    const yesterday = this.backDate(1);
    const minus7 = this.backDate(7);
    const minus30 = this.backDate(30);
    const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    this.presets =  [
      {
        presetLabel: 'Yesterday', range: { fromDate: yesterday, toDate: today }
      },
      {
        presetLabel: 'Last 7 Days', range: { fromDate: minus7, toDate: today }
      },
      {
        presetLabel: 'Last 30 Days', range: { fromDate: minus30, toDate: today }
      },
      {
        presetLabel: 'This Month', range: { fromDate: currMonthStart, toDate: currMonthEnd }
      },
      {
        presetLabel: 'Last Month', range: { fromDate: lastMonthStart, toDate: lastMonthEnd }
      }
    ];
  }
}
