import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Chart } from 'chart.js';

import { TransactionsService } from 'src/app/reports/transactions.service';
import { DailyWorth } from 'src/app/data-access/data-access.model';

@Component({
  selector: 'app-net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.css']
})
export class NetWorthComponent implements OnInit, OnDestroy {

  private netWorthSubscription: Subscription;
  private dailyWorth: DailyWorth;

  @ViewChild('netWorthChart') myChartRef: ElementRef;
  chartObj: Chart;

  constructor(
    private _transactionService: TransactionsService
  ) { }

  ngOnInit() {
    this.netWorthSubscription = this._transactionService.dailyWorthSummary.subscribe(
      (value) => {
        this.dailyWorth = value;

        this.createChart();
      }
    );
  }

  ngOnDestroy() {
    this.netWorthSubscription.unsubscribe();
  }

  private createChart() {

    const labels: string[] = [];
    const dataPoints: number[] = [];

    this.dailyWorth.dailyWorth.forEach((value) => {
      labels.push(value.date);
      dataPoints.push(value.total);
    });

    if (this.chartObj !== undefined) {
      this.chartObj.destroy();
    }

    this.chartObj = new Chart((<HTMLCanvasElement>this.myChartRef.nativeElement),
      {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              data: dataPoints
            }
          ]
        },
        options: {

        }
      });

  }

}
