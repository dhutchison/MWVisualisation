import { Component, OnInit } from '@angular/core';
import { TrendData, TrendFilter } from 'src/app/data-access/data-access.model';
import { DataAccessService } from 'src/app/data-access/data-access.service';

@Component({
  selector: 'app-expense-trend',
  templateUrl: './expense-trend.component.html',
  styleUrls: ['./expense-trend.component.css']
})
export class ExpenseTrendComponent implements OnInit {

  private trendData: TrendData[];

  constructor(
    private _dataAccessService: DataAccessService
  ) { }

  ngOnInit() {
  }

  onFilterChanged(filter: TrendFilter): void {
    this._dataAccessService.loadExpenseTrend(filter)
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
