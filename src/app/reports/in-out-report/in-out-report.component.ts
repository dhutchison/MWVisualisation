import { Component, OnInit } from '@angular/core';
import { InOutSummary } from './shared/in-out.model';
import * as CanvasJS from '../../../assets/canvasjs.min';

@Component({
  selector: 'app-in-out-report',
  templateUrl: './in-out-report.component.html',
  styleUrls: ['./in-out-report.component.css']
})
export class InOutReportComponent implements OnInit {

  private _data: InOutSummary[] = [];

  constructor() { }

  ngOnInit() {
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Basic Column Chart in Angular"
      },
      data: [{
        type: "column",
        dataPoints: [
          { y: 71, label: "Apple" },
          { y: 55, label: "Mango" },
          { y: 50, label: "Orange" },
          { y: 65, label: "Banana" },
          { y: 95, label: "Pineapple" },
          { y: 68, label: "Pears" },
          { y: 28, label: "Grapes" },
          { y: 34, label: "Lychee" },
          { y: 14, label: "Jackfruit" }
        ]
      }]
    });
      
    chart.render();
  }

}
