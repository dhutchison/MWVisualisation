import { Component, OnInit } from '@angular/core';
import { DataAccessService } from 'src/app/data-access/data-access.service';
import { TrendData, TrendFilter } from 'src/app/data-access/data-access.model';

@Component({
  selector: 'app-net-worth-trend',
  templateUrl: './net-worth-trend.component.html',
  styleUrls: ['./net-worth-trend.component.css']
})
export class NetWorthTrendComponent implements OnInit {

  trendData: TrendData[];

  constructor(
    private _dataAccessService: DataAccessService
  ) { }

  ngOnInit() {
  }

  onFilterChanged(filter: TrendFilter): void {

    /* Load the data */
    this._dataAccessService.loadNetWorthTrend(filter)
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
