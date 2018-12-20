import { Component, OnInit } from '@angular/core';

import { DataAccessService } from 'src/app/data-access/data-access.service';
import { TrendData, TrendFilter, TrendFilterGroup, BucketType } from 'src/app/data-access/data-access.model';

@Component({
  selector: 'app-income-trend',
  templateUrl: './income-trend.component.html',
  styleUrls: ['./income-trend.component.css']
})
export class IncomeTrendComponent implements OnInit {

  trendData: TrendData[];

  constructor(
    private _dataAccessService: DataAccessService
  ) { }

  ngOnInit() {
  }

  onFilterChanged(filter: TrendFilter): void {

    /* Add in screen-specific config */
    filter.grouping = TrendFilterGroup.Bucket;
    filter.groupingFilter = BucketType.Income;

    /* Load the data */
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
