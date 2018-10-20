import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
/* TODO:
 * Add reports for:
 * Monthly spend variation (trends / buckets)
 * View of total money over time (area type graph, starting balance then use transactions to show day-by-day worth)
 */
export class ReportsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
