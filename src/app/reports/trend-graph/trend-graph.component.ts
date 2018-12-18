import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import * as pallete from 'google-palette';
import { Chart, ChartDataSets } from 'chart.js';

import { TrendData, DateTotal } from 'src/app/data-access/data-access.model';

@Component({
  selector: 'app-trend-graph',
  templateUrl: './trend-graph.component.html',
  styleUrls: ['./trend-graph.component.css']
})
export class TrendGraphComponent implements OnInit {

  private _trendData: TrendData[] = [];

  @ViewChild('trendChart') myChartRef: ElementRef;
  private chartObj: Chart;

  constructor() { }

  ngOnInit() {
  }

  @Input()
  set trendData(value: TrendData[]) {

    /* Ensure setting non-null value */
    if (value) {
      this._trendData = value;
    } else {
      this._trendData = [];
    }

    this.createChart();

  }

  private createChart() {

    /* Get all the distinct labels for the combined data sets */
    const labelSet = new Set<string>();
    this._trendData.forEach(trendDataSet => {
      trendDataSet.dataPoints.forEach(dataPoint => labelSet.add(dataPoint.date));
    });

    const labels = Array.from(labelSet).sort();

    /* Define the colours we can use */
    /* Need to stick to one of the following to not hit colour limits.
     * If the limit is hit, null is returned from the pallete function.
     * mpn65
     * tol-dv (colourblind friendly)
     * tol-sq (colourblind friendly)
     * tol-rainbow (colourblind friendly)
     */
    const colours = pallete('tol-rainbow', this._trendData.length)
      .map((hex) => {
        return '#' + hex;
      });

    console.log('Chart labels:');
    console.log(labels);

    /* Set up the data sets */
    const dataSets: ChartDataSets[] = [];

    this._trendData.forEach((trendDataSet: TrendData, index: number) => {
      console.log(trendDataSet);

      const dataPoints: number[] = this.getDataNumbers(trendDataSet.dataPoints, labels);

      const dataSet: ChartDataSets = {
        data: dataPoints,
        label: trendDataSet.label,
        backgroundColor: colours[index]
      };
      dataSets.push(dataSet);
    });

    console.log('Chart Datasets: ');
    console.log(dataSets);

    if (this.chartObj !== undefined) {
      this.chartObj.destroy();
    }

    this.chartObj = new Chart((<HTMLCanvasElement>this.myChartRef.nativeElement),
      {
        // TODO: Stacked varient to show how total income for the period has been made up?
        type: 'bar',
        data: {
          labels: labels,
          datasets: dataSets
        },
        options: {
          scales: {
            xAxes: [{
              stacked: true
            }],
            yAxes: [{
              stacked: true
            }]
          }
        }
      });

  }

  private getDataNumbers(array: DateTotal[], labels: string[]): number[] {

    const dataNumbers: number[] = [];
    let labelIndex = 0;

    array.forEach((value) => {
      console.log('In array forEach');
      console.log(value);
      console.log(labelIndex);

      let labelMatch = false;

      while (!labelMatch && labelIndex < labels.length) {

        if (labels[labelIndex] === value.date) {
          /* If the data point is for the current label, add it */
          dataNumbers.push(value.total);
          labelMatch = true;
        } else {
          /* Add in a zero - if we were doing a line chart then NaN would be more appropriate */
          dataNumbers.push(0);
          /* Otherwise add in a NaN as we don't have data for this label in this data set */
        }
        labelIndex += 1;
      }

    });

    return dataNumbers;
  }

}
