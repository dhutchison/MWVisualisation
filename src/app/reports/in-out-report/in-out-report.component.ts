import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { InOutSummary } from '../../data/data-access.model';

import { Chart } from 'chart.js';

import { TransactionsService } from '../../transactions/transactions.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-in-out-report',
  templateUrl: './in-out-report.component.html',
  styleUrls: ['./in-out-report.component.css']
})
export class InOutReportComponent implements OnInit, OnDestroy {

  private _data: InOutSummary[] = [];
  private inOutSubscription: Subscription;

  @ViewChild('inOutChart') myChartRef: ElementRef;
  chartObj: Chart;

  constructor(
    private _transactionService: TransactionsService
  ) { }

  ngOnInit() {

    this.inOutSubscription = this._transactionService.accountInOutSummary.subscribe(
      (value: InOutSummary[]) => {
        this._data = value;

        this.createChart();
    });
  }

  createChart(): void {

    let labels: string[] = [];
    let inDataPoints: number[] = [];
    let outDataPoints: number[] = [];

    this._data.forEach((value) => {
      labels.push(value.name);
      inDataPoints.push(value.moneyIn);
      outDataPoints.push(value.moneyOut);
    });

    if (this.chartObj !== undefined) {
      this.chartObj.destroy();
    }

    this.chartObj = new Chart((<HTMLCanvasElement>this.myChartRef.nativeElement), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'In',
            data: inDataPoints,
            backgroundColor: 'green',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Out',
            data: outDataPoints,
            backgroundColor: 'red',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  ngOnDestroy() {
    this.inOutSubscription.unsubscribe();
  }

}
