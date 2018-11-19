import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as pallete from 'google-palette';

import { Chart, ChartDataSets } from 'chart.js';
import { DataAccessService } from 'src/app/data-access/data-access.service';
import { TrendData, TimePeriod, DateTotal } from 'src/app/data-access/data-access.model';

@Component({
  selector: 'app-income-trend',
  templateUrl: './income-trend.component.html',
  styleUrls: ['./income-trend.component.css']
})
export class IncomeTrendComponent implements OnInit {

  private trendData: TrendData[];

  @ViewChild('incomeTrendChart') myChartRef: ElementRef;
  chartObj: Chart;

  constructor(
    private _dataAccessService: DataAccessService
  ) { }

  ngOnInit() {

    this._dataAccessService.loadIncomeTrend(TimePeriod.YEAR)
      .then((value) => {
        this.trendData = value;
        console.log('Data Loaded')
        console.log(this.trendData);

        this.createChart();
      })
      .catch((err) => {
        //TODO: Implement
      });
  }

  private createChart() {

    /* Get all the distinct labels for the combined data sets */
    let labelSet = new Set<string>();
    this.trendData.forEach(trendDataSet => {
        trendDataSet.dataPoints.forEach(dataPoint => labelSet.add(dataPoint.date));
      });

    let labels = Array.from(labelSet).sort();

    /* Define the colours we can use */
    /* Need to stick to one of the following to not hit colour limits.
     * If the limit is hit, null is returned from the pallete function.
     * mpn65
     * tol-dv (colourblind friendly)
     * tol-sq (colourblind friendly)
     * tol-rainbow (colourblind friendly)
     */
    let colours = pallete('tol-rainbow', this.trendData.length)
      .map((hex) => {
        return '#' + hex;
      });

    console.log("Chart labels:");
    console.log(labels);

    /* Set up the data sets */
    let dataSets: ChartDataSets[] = [];

    this.trendData.forEach((trendDataSet: TrendData, index: number) => {
      console.log(trendDataSet)

      let dataPoints: number[] = this.getDataNumbers(trendDataSet.dataPoints, labels);

      let dataSet: ChartDataSets = {
        data: dataPoints,
        label: trendDataSet.label,
        backgroundColor: colours[index]
      };
      dataSets.push(dataSet);
    });

    console.log("Chart Datasets: ");
    console.log(dataSets);

    if (this.chartObj !== undefined) {
      this.chartObj.destroy();
    }

    this.chartObj = new Chart((<HTMLCanvasElement>this.myChartRef.nativeElement), 
      {
        //TODO: Stacked varient to show how total income for the period has been made up?
        type: 'bar',
        data: {
          labels: labels,
          datasets: dataSets
        },
        options: {

        }
      });

  }

  private getDataNumbers(array: DateTotal[], labels: string[]): number[] {

    let dataNumbers: number[] = [];
    let labelIndex = 0;

    array.forEach((value) => {
      console.log("In array forEach")
      console.log(value);
      console.log(labelIndex);

      let labelMatch = false;

      while (!labelMatch && labelIndex < array.length) {
        console.log("In loop:")
        console.log(labels[labelIndex]);
        console.log(value.date);
        console.log(labelMatch);
        console.log(labelIndex);
        console.log(array.length);
        if (labels[labelIndex] === value.date) {
          /* If the data point is for the current label, add it */
          console.log('Match0!');
          console.log(dataNumbers);
          console.log(value.total);
          dataNumbers.push(value.total);
          labelMatch = true;
          console.log('Match1!');
        } else {
          /* Otherwise add in a NaN as we don't have data for this label in this data set */
          console.log('No Match0!')
          dataNumbers.push(NaN);
          console.log('No Match1!')
        }
        labelIndex += 1;
        console.log('New label index')
        console.log(labelIndex);
      }

    });

    return dataNumbers;
  }

}
