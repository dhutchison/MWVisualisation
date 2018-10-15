import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';

import { InOutSummary } from '../shared/in-out.model';
import { TransactionsService } from '../../transactions/transactions.service';

@Component({
  selector: 'app-bucket-summary',
  templateUrl: './bucket-summary.component.html',
  styleUrls: ['./bucket-summary.component.css']
})
export class BucketSummaryComponent implements OnInit, OnDestroy {

  @ViewChild('inBucketChart') inChartRef: ElementRef;
  @ViewChild('outBucketChart') outChartRef: ElementRef;
  inChartObj: Chart;
  outChartObj: Chart;

  private _data: InOutSummary[] = [];
  private inOutSubscription: Subscription;

  constructor(
    private _transactionService: TransactionsService
  ) { }

  ngOnInit() {

    this.inOutSubscription = this._transactionService.bucketInOutSummary.subscribe(
      (value: InOutSummary[]) => {
        this._data = value;

        this.createIncomeChart();
        this.createExpenseChart();
      });
  }

  ngOnDestroy() {
    this.inOutSubscription.unsubscribe();
  }

  private createIncomeChart() {
    let labels: string[] = [];
    let dataPoints: number[] = [];

    this._data.forEach((value) => {
      if (value.moneyIn > 0) {
        labels.push(value.name);
        dataPoints.push(value.moneyIn);
      }
    });

    if (this.inChartObj !== undefined) {
      this.inChartObj.destroy();
    }

    this.inChartObj = new Chart(this.inChartRef.nativeElement, {
      data: {
          datasets: [{
              data: dataPoints
          }],
          labels: labels
      },
      type: 'polarArea',
      options: {}
    });
  }

  private createExpenseChart() {
    let labels: string[] = [];
    let dataPoints: number[] = [];

    this._data.forEach((value) => {
      if (value.moneyOut > 0) {
        labels.push(value.name);
        dataPoints.push(value.moneyOut);
      }
    });

    if (this.outChartObj !== undefined) {
      this.outChartObj.destroy();
    }

    this.outChartObj = new Chart(this.outChartRef.nativeElement, {
      data: {
          datasets: [{
              data: dataPoints
          }],
          labels: labels
      },
      type: 'polarArea',
      options: {}
    });
  }

}
