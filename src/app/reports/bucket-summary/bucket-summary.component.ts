import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';

import { InOutSummary } from '../shared/in-out.model';
import { TransactionsService } from '../../transactions/transactions.service';

import * as pallete from 'google-palette';

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

    this.inChartObj = this.createChart(labels, dataPoints, this.inChartRef);
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

    this.outChartObj = this.createChart(labels, dataPoints, this.outChartRef);
  }

  private createChart(labels: string[], dataPoints: number[], element: ElementRef): Chart {

    /* Need to stick to one of the following to not hit colour limits.
     * If the limit is hit, null is returned from the pallete function.
     * mpn65
     * tol-dv (colourblind friendly)
     * tol-sq (colourblind friendly)
     * tol-rainbow (colourblind friendly)
     */
    let colours = pallete('tol-rainbow', dataPoints.length)
      .map((hex) => {
        return '#' + hex;
      });

    let chart = new Chart(element.nativeElement, {
      data: {
        datasets: [{
          data: dataPoints,
          backgroundColor: colours
        }],
        labels: labels
      },
      type: 'pie',
      options: {}
    });

    return chart;
  }

}
