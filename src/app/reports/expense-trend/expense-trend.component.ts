import { Component, OnInit } from '@angular/core';
import { TrendData, TrendFilter, TrendFilterGroup, BucketType } from 'src/app/data-access/data-access.model';
import { DataAccessService } from 'src/app/data-access/data-access.service';

@Component({
  selector: 'app-expense-trend',
  templateUrl: './expense-trend.component.html',
  styleUrls: ['./expense-trend.component.css']
})
export class ExpenseTrendComponent implements OnInit {

  trendData: TrendData[];

  constructor(
    private _dataAccessService: DataAccessService
  ) { }

  ngOnInit() {
  }

  onFilterChanged(filter: TrendFilter): void {

    /* Add in screen-specific config */
    filter.grouping = TrendFilterGroup.Bucket;
    filter.groupingFilter = BucketType.Expense;

    this._dataAccessService.loadTransactionTrend(filter)
      .then((value) => {
        console.log('Data Loaded');
        console.log(value);
        this.trendData = value;
      })
      .catch((err) => {
        // TODO: Implement
      });
  }

}
