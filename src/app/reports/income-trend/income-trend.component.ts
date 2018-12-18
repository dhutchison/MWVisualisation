import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as pallete from 'google-palette';

import { Chart, ChartDataSets } from 'chart.js';
import { DataAccessService } from 'src/app/data-access/data-access.service';
import { TrendData, TimePeriod, DateTotal, TrendFilter } from 'src/app/data-access/data-access.model';

@Component({
  selector: 'app-income-trend',
  templateUrl: './income-trend.component.html',
  styleUrls: ['./income-trend.component.css']
})
export class IncomeTrendComponent implements OnInit {

  private trendData: TrendData[];

  constructor(
    private _dataAccessService: DataAccessService
  ) { }

  ngOnInit() {
  }

  onFilterChanged(filter: TrendFilter): void {
    this._dataAccessService.loadIncomeTrend(filter)
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
